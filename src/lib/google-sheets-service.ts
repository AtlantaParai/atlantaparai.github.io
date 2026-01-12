export class GoogleSheetsService {
  private static SHEET_ID = process.env.NEXT_PUBLIC_ATTENDANCE_SHEET_ID || '';
  
  static async appendAttendanceRecord(data: {
    date: string;
    section: string;
    memberName: string;
    status: string;
    recordedBy: string;
  }, accessToken: string) {
    const values = [[
      data.date,
      data.section,
      data.memberName,
      data.status,
      data.recordedBy
    ]];

    const response = await fetch(
      `https://sheets.googleapis.com/v4/spreadsheets/${this.SHEET_ID}/values/Attendance:append?valueInputOption=RAW`,
      {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${accessToken}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ values })
      }
    );

    if (!response.ok) {
      throw new Error(`Failed to save attendance: ${response.status}`);
    }

    return await response.json();
  }

  static async getTodayAttendance(section: string, accessToken: string) {
    const today = new Date().toISOString().split('T')[0];
    const response = await fetch(
      `https://sheets.googleapis.com/v4/spreadsheets/${this.SHEET_ID}/values/Attendance`,
      {
        headers: {
          'Authorization': `Bearer ${accessToken}`,
        }
      }
    );

    if (!response.ok) {
      throw new Error(`Failed to fetch attendance: ${response.status}`);
    }

    const data = await response.json();
    const rows = data.values || [];
    
    return rows.filter((row: string[]) => 
      row[0] === today && row[1] === section
    ).map((row: string[]) => ({
      date: row[0],
      section: row[1],
      memberName: row[2],
      status: row[3],
      recordedBy: row[4],
      timestamp: row[5]
    }));
  }

  static async getAllAttendanceData(accessToken: string) {
    const response = await fetch(
      `https://sheets.googleapis.com/v4/spreadsheets/${this.SHEET_ID}/values/Attendance`,
      {
        headers: {
          'Authorization': `Bearer ${accessToken}`,
        }
      }
    );

    if (!response.ok) {
      throw new Error(`Failed to fetch attendance: ${response.status}`);
    }

    const data = await response.json();
    const rows = data.values || [];
    
    return rows.slice(1).map((row: string[]) => ({
      date: row[0],
      section: row[1],
      memberName: row[2],
      status: row[3],
      recordedBy: row[4],
      timestamp: row[5]
    }));
  }
}