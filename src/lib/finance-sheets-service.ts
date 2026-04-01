export class FinanceSheetsService {
  private static getSheetId(section: string): string {
    const sheetIds = {
      'Core Adults': process.env.NEXT_PUBLIC_FINANCE_CORE_ADULTS_SHEET_ID || '',
      'Core Teens Kids': process.env.NEXT_PUBLIC_FINANCE_CORE_TEENS_KIDS_SHEET_ID || ''
    };
    return sheetIds[section as keyof typeof sheetIds] || sheetIds['Core Adults'];
  }
  
  private static getSheetName(section: string): string {
    const sheetNames = {
      'Core Adults': 'Adult Core Team',
      'Core Teens Kids': 'APT Core Teens'
    };
    return sheetNames[section as keyof typeof sheetNames] || 'Sheet1';
  }
  
  private static getCurrentMonthHeader(): string {
    const now = new Date();
    const month = now.toLocaleString('en-US', { month: 'long' });
    const year = now.getFullYear();
    return `${month}'${year}`;
  }

  private static findMonthColumn(headerRow: string[]): { column: string; index: number } | null {
    const target = this.getCurrentMonthHeader();
    console.log('Looking for column:', target);
    console.log('Available headers:', headerRow);
    for (let i = 0; i < headerRow.length; i++) {
      if (headerRow[i]?.trim() === target) {
        const column = String.fromCharCode(65 + i);
        return { column, index: i };
      }
    }
    return null;
  }
  
  static async updatePaymentStatus(data: {
    memberName: string;
    section: string;
    status: string;
    updatedBy: string;
  }, accessToken: string) {
    try {
      const sheetId = this.getSheetId(data.section);
      const sheetName = this.getSheetName(data.section);
      
      const response = await fetch(
        `https://sheets.googleapis.com/v4/spreadsheets/${sheetId}/values/${encodeURIComponent(sheetName)}`,
        {
          headers: { 'Authorization': `Bearer ${accessToken}` }
        }
      );

      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`Failed to fetch data: ${response.status} - ${errorText}`);
      }

      const sheetData = await response.json();
      const rows = sheetData.values || [];
      
      // Row 6 (index 5) has month headers
      const headerRow = rows[5] || [];
      const columnInfo = this.findMonthColumn(headerRow);
      if (!columnInfo) {
        throw new Error(`Column for ${this.getCurrentMonthHeader()} not found in spreadsheet`);
      }

      // Find the member's row (name is in column C)
      let rowIndex = -1;
      for (let i = 6; i < rows.length; i++) {
        if (rows[i][2]?.replace(/\s+/g, ' ').trim() === data.memberName.replace(/\s+/g, ' ').trim()) {
          rowIndex = i + 1; // Google Sheets is 1-indexed
          break;
        }
      }

      if (rowIndex === -1) {
        throw new Error(`Member ${data.memberName} not found in spreadsheet`);
      }

      const range = `${sheetName}!${columnInfo.column}${rowIndex}`;
      const values = [[data.status === 'paid' ? '$20' : '']];

      const updateResponse = await fetch(
        `https://sheets.googleapis.com/v4/spreadsheets/${sheetId}/values/${encodeURIComponent(range)}?valueInputOption=RAW`,
        {
          method: 'PUT',
          headers: {
            'Authorization': `Bearer ${accessToken}`,
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ values })
        }
      );

      if (!updateResponse.ok) {
        const errorText = await updateResponse.text();
        throw new Error(`Failed to update payment status: ${updateResponse.status} - ${errorText}`);
      }

      return await updateResponse.json();
    } catch (error) {
      console.error('Error updating payment status:', error);
      throw error;
    }
  }

  static async getPaymentStatus(section: string, accessToken: string) {
    try {
      const sheetId = this.getSheetId(section);
      const sheetName = this.getSheetName(section);
      
      const response = await fetch(
        `https://sheets.googleapis.com/v4/spreadsheets/${sheetId}/values/${encodeURIComponent(sheetName)}`,
        {
          headers: { 'Authorization': `Bearer ${accessToken}` }
        }
      );

      if (!response.ok) {
        throw new Error(`Failed to fetch payment status: ${response.status}`);
      }

      const data = await response.json();
      const rows = data.values || [];
      if (rows.length < 7) return [];

      // Row 6 (index 5) has month headers
      const headerRow = rows[5] || [];
      const columnInfo = this.findMonthColumn(headerRow);
      if (!columnInfo) {
        console.warn(`Column for ${this.getCurrentMonthHeader()} not found`);
        return [];
      }
      
      // Data starts after row 6
      return rows.slice(6).map((row: string[]) => ({
        memberName: row[2] || '',
        status: row[columnInfo.index]?.trim() ? 'paid' : 'unpaid'
      }));
    } catch (error) {
      console.error('Error fetching payment status:', error);
      return [];
    }
  }
}
