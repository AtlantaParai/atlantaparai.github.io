export class MembersSheetsService {
  private static SHEET_ID = process.env.NEXT_PUBLIC_MEMBERS_SHEET_ID || '';
  
  static async getMemberPermissions(accessToken: string) {
    console.log('Fetching member permissions from sheet:', this.SHEET_ID);
    const response = await fetch(
      `https://sheets.googleapis.com/v4/spreadsheets/${this.SHEET_ID}/values/Login`,
      {
        headers: {
          'Authorization': `Bearer ${accessToken}`,
        }
      }
    );

    if (!response.ok) {
      console.error('Failed to fetch members:', response.status, await response.text());
      throw new Error(`Failed to fetch members: ${response.status}`);
    }

    const data = await response.json();
    const rows = data.values || [];
    console.log('Sheet rows received:', rows.length);
    
    if (rows.length === 0) return { authorizedEmails: [], attendanceEmails: [], financeEmails: [] };
    
    // Skip header row
    // Columns: Name (0), EmailID (1), Attendance (2), Finance (3)
    const authorizedEmails: string[] = [];
    const attendanceEmails: string[] = [];
    const financeEmails: string[] = [];
    
    rows.slice(1).forEach((row: string[]) => {
      const emailCell = row[1];
      const hasAttendance = row[2]?.toLowerCase() === 'yes';
      const hasFinance = row[3]?.toLowerCase() === 'yes';
      
      if (!emailCell) return;
      
      // Split by comma and trim whitespace
      const emails = emailCell.split(',').map(email => email.trim().toLowerCase()).filter(Boolean);
      
      emails.forEach(email => {
        authorizedEmails.push(email);
        if (hasAttendance) attendanceEmails.push(email);
        if (hasFinance) financeEmails.push(email);
      });
    });
    
    console.log('Authorized emails:', authorizedEmails);
    console.log('Attendance emails:', attendanceEmails);
    console.log('Finance emails:', financeEmails);
    
    return { authorizedEmails, attendanceEmails, financeEmails };
  }
  
  static async getAuthorizedEmails(accessToken: string): Promise<string[]> {
    const permissions = await this.getMemberPermissions(accessToken);
    return permissions.authorizedEmails;
  }
}
