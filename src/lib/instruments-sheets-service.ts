export interface InstrumentRecord {
  id: string;
  name: string;
  type: string;
  image: string;
  status: 'available' | 'checked_out';
  checkedOutBy: string | null;
  checkedOutAt: string | null;
}

export class InstrumentsSheetsService {
  private static readonly SHEET_ID = process.env.NEXT_PUBLIC_INSTRUMENTS_SHEET_ID || '1your-sheet-id';
  private static readonly SHEET_NAME = 'instruments';

  static async getAllInstruments(accessToken: string): Promise<InstrumentRecord[]> {
    try {
      console.log('Instruments Sheet ID:', this.SHEET_ID);
      console.log('Environment variable:', process.env.NEXT_PUBLIC_INSTRUMENTS_SHEET_ID);
      const response = await fetch(
        `https://sheets.googleapis.com/v4/spreadsheets/${this.SHEET_ID}/values/${this.SHEET_NAME}!A:G`,
        {
          headers: {
            'Authorization': `Bearer ${accessToken}`,
          }
        }
      );
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      const data = await response.json();
      const rows = data.values || [];
      
      // Skip header row
      return rows.slice(1).map((row: string[]) => ({
        id: row[0] || '',
        name: row[1] || '',
        type: row[2] || '',
        image: row[3] || '',
        status: (row[4] || 'available') as 'available' | 'checked_out',
        checkedOutBy: row[5] || null,
        checkedOutAt: row[6] || null
      }));
    } catch (error) {
      console.error('Error fetching instruments:', error);
      return [];
    }
  }

  static async updateInstrumentStatus(
    instrumentId: string,
    status: 'available' | 'checked_out',
    checkedOutBy: string | null,
    accessToken: string
  ): Promise<void> {
    try {
      // First, get all data to find the row
      const instruments = await this.getAllInstruments(accessToken);
      const instrumentIndex = instruments.findIndex(inst => inst.id === instrumentId);
      
      if (instrumentIndex === -1) {
        throw new Error('Instrument not found');
      }
      
      const rowNumber = instrumentIndex + 2; // +2 because of header row and 0-based index
      const checkedOutAt = status === 'checked_out' ? new Date().toISOString() : null;
      
      const updateData = {
        values: [[status, checkedOutBy || '', checkedOutAt || '']]
      };
      
      const response = await fetch(
        `https://sheets.googleapis.com/v4/spreadsheets/${this.SHEET_ID}/values/${this.SHEET_NAME}!E${rowNumber}:G${rowNumber}?valueInputOption=RAW`,
        {
          method: 'PUT',
          headers: {
            'Authorization': `Bearer ${accessToken}`,
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(updateData)
        }
      );
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
    } catch (error) {
      console.error('Error updating instrument status:', error);
      throw error;
    }
  }

  static async initializeInstruments(initialInstruments: any[], accessToken: string): Promise<void> {
    try {
      // Check if sheet has data beyond headers
      const existing = await this.getAllInstruments(accessToken);
      if (existing.length > 0) {
        console.log('Sheet already has instrument data, skipping initialization');
        return; // Already initialized
      }
      
      console.log('Adding instrument data to sheet...');
      // Add instrument data starting from row 2 (after headers)
      const rows = initialInstruments.map(inst => [
        inst.id,
        inst.name,
        inst.type,
        inst.image,
        'available',
        '',
        ''
      ]);
      
      const response = await fetch(
        `https://sheets.googleapis.com/v4/spreadsheets/${this.SHEET_ID}/values/${this.SHEET_NAME}!A2:G?valueInputOption=RAW`,
        {
          method: 'PUT',
          headers: {
            'Authorization': `Bearer ${accessToken}`,
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ values: rows })
        }
      );
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      console.log('Instruments initialized successfully');
    } catch (error) {
      console.error('Error initializing instruments:', error);
      throw error;
    }
  }
}