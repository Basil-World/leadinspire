// Google Sheets API configuration
const GOOGLE_SHEETS_API_KEY = import.meta.env.VITE_GOOGLE_SHEETS_API_KEY;
const PLUS_ONE_SHEET_ID = import.meta.env.VITE_GOOGLE_SHEET_PLUS_ONE_ID;
const PLUS_TWO_SHEET_ID = import.meta.env.VITE_GOOGLE_SHEET_PLUS_TWO_ID;
const PLUS_ONE_RANGE = import.meta.env.VITE_GOOGLE_SHEET_PLUS_ONE_RANGE || 'E6!A2:B59';
const PLUS_TWO_RANGE = import.meta.env.VITE_GOOGLE_SHEET_PLUS_TWO_RANGE || 'E6!A2:B59';

export interface Student {
  id: string;
  name: string;
  totalScore: number;
  weeklyScores: number[];
  rank: number;
  trend: 'up' | 'down' | 'stable';
}

export interface StudentChapterDetails {
  name: string;
  totalScore?: number;
  chapters: { chapter: string; score: number }[];
}

export interface GoogleSheetsRow {
  name: string;
  week1: number;
  week2: number;
  week3: number;
  week4: number;
  week5: number;
  totalScore: number;
}

/**
 * Fetches data from Google Sheets for a specific class
 */
export const fetchGoogleSheetsData = async (classType: 'plus-one' | 'plus-two'): Promise<Student[]> => {
  try {
    if (!GOOGLE_SHEETS_API_KEY || !PLUS_ONE_SHEET_ID || !PLUS_TWO_SHEET_ID) {
      throw new Error('Google Sheets API configuration is missing. Please check your environment variables.');
    }

    const sheetId = classType === 'plus-one' ? PLUS_ONE_SHEET_ID : PLUS_TWO_SHEET_ID;
    const range = classType === 'plus-one' ? PLUS_ONE_RANGE : PLUS_TWO_RANGE;
    
    const ranges = [
      range,
      classType === 'plus-one' 
        ? 'E6!A2:B60'  // Fallback for plus-one (up to 60 rows)
        : 'E6!A2:B74', // Fallback for plus-two (up to 74 rows)
      classType === 'plus-one'
        ? 'A2:B60'     // Another fallback for plus-one
        : 'A2:B74'     // Another fallback for plus-two
    ];

    let rows = null;
    let lastError = null;

    for (const range of ranges) {
      try {
        const url = `https://sheets.googleapis.com/v4/spreadsheets/${sheetId}/values/${encodeURIComponent(range)}?key=${GOOGLE_SHEETS_API_KEY}`;
        
        console.log('Trying range:', range);
        console.log('URL:', url);
        
        const response = await fetch(url);
        
        if (response.ok) {
          const data = await response.json();
          rows = data.values;
          console.log('Success with range:', range);
          break;
        } else {
          const errorData = await response.json().catch(() => ({}));
          lastError = `Range "${range}": ${response.status} - ${errorData.error?.message || 'Unknown error'}`;
          console.log('Failed with range:', range, lastError);
        }
      } catch (error) {
        lastError = `Range "${range}": ${error instanceof Error ? error.message : 'Unknown error'}`;
        console.log('Error with range:', range, lastError);
      }
    }

    if (!rows) {
      throw new Error(`Failed to fetch data from any range. Last error: ${lastError}`);
    }
    
    if (!rows || rows.length === 0) {
      if (classType === 'plus-two') {
        // Return empty array for Plus Two if no data (exam not started)
        return [];
      }
      throw new Error(`No data found in Google Sheets for ${classType}`);
    }

    // Process data directly (no header row since we're fetching A2:D59)
    const students: Student[] = rows
      .map((row, index) => {
        try {
          // Format: [Name, Total]
          const [name, totalScore] = row;
          
          if (!name || name.toString().trim() === '') return null; // Skip empty rows
          
          // Since we only need name and total, set weekly scores to zeros
          const weeklyScores = [0, 0, 0, 0, 0]; // All zeros since we only have total
          
          const total = parseFloat(totalScore) || 0;
          
          return {
            id: `${classType}-${index + 1}`,
            name: name.toString().trim(),
            weeklyScores,
            totalScore: total,
            rank: 0, // Will be calculated after sorting
            trend: 'stable' as const, // Will be calculated based on previous data
          };

        } catch (error) {
          console.warn(`Error processing row ${index + 1}:`, error);
          return null;
        }
      })
      .filter((student): student is Student => student !== null);

    // Sort by total score and assign ranks
    students.sort((a, b) => b.totalScore - a.totalScore);
    students.forEach((student, index) => {
      student.rank = index + 1;
    });

    // Calculate trends (simplified - you might want to store previous data for accurate trends)
    students.forEach(student => {
      const scores = student.weeklyScores;
      if (scores.length >= 2) {
        const recent = scores.slice(-2);
        if (recent[1] > recent[0]) {
          student.trend = 'up';
        } else if (recent[1] < recent[0]) {
          student.trend = 'down';
        } else {
          student.trend = 'stable';
        }
      }
    });

    return students;
  } catch (error) {
    console.error('Error fetching Google Sheets data:', error);
    throw new Error(`Failed to fetch data from Google Sheets: ${error instanceof Error ? error.message : 'Unknown error'}`);
  }
};

/**
 * Fetch detailed chapter-wise marks for a single student.
 * Assumptions based on provided sheet layout:
 * - Row 1 has chapter headers from column C to Z (C1:Z1)
 * - Column A has student names, column B may have total, columns C..Z have chapter marks
 * - Data rows start at row 2
 */
export const fetchStudentChapterDetails = async (
  classType: 'plus-one' | 'plus-two',
  studentName: string
): Promise<StudentChapterDetails | null> => {
  if (!GOOGLE_SHEETS_API_KEY || !PLUS_ONE_SHEET_ID || !PLUS_TWO_SHEET_ID) {
    throw new Error('Google Sheets API configuration is missing. Please check your environment variables.');
  }

  const sheetId = classType === 'plus-one' ? PLUS_ONE_SHEET_ID : PLUS_TWO_SHEET_ID;

  // We fetch a generous range to cover typical data sizes
  const headerRange = 'C1:Z1';
  const dataRange = 'A2:Z500';

  // 1) Fetch headers for chapters
  const headersRes = await fetch(
    `https://sheets.googleapis.com/v4/spreadsheets/${sheetId}/values/${encodeURIComponent(headerRange)}?key=${GOOGLE_SHEETS_API_KEY}`
  );
  if (!headersRes.ok) {
    const err = await headersRes.json().catch(() => ({} as any));
    throw new Error(`Failed to load chapter headers: ${err.error?.message || headersRes.statusText}`);
  }
  const headersJson = await headersRes.json();
  const headerRow: string[] = (headersJson.values?.[0] || []).map((h: any) => (h ?? '').toString().trim());

  // 2) Fetch data rows
  const dataRes = await fetch(
    `https://sheets.googleapis.com/v4/spreadsheets/${sheetId}/values/${encodeURIComponent(dataRange)}?key=${GOOGLE_SHEETS_API_KEY}`
  );
  if (!dataRes.ok) {
    const err = await dataRes.json().catch(() => ({} as any));
    throw new Error(`Failed to load student data: ${err.error?.message || dataRes.statusText}`);
  }
  const dataJson = await dataRes.json();
  const rows: any[][] = dataJson.values || [];

  // Try to find the student's row. Prefer exact match in column A (index 0). Fallback to case-insensitive trim.
  const normalizedTarget = studentName.trim().toLowerCase();
  const row = rows.find(r => (r?.[0]?.toString().trim().toLowerCase() || '') === normalizedTarget);
  if (!row) {
    // Try column B as a fallback for name if needed
    const rowB = rows.find(r => (r?.[1]?.toString().trim().toLowerCase() || '') === normalizedTarget);
    if (!rowB) return null;
    // Use rowB and treat B as name
    const totalMaybe = rowB[1];
    const chapterValues = rowB.slice(2, 26); // C..Z -> indexes 2..25
    const chapters = headerRow.map((chapter, i) => ({
      chapter: chapter || `Chapter ${i + 1}`,
      score: parseFloat(chapterValues[i]) || 0,
    }));
    return {
      name: studentName,
      totalScore: parseFloat(totalMaybe) || undefined,
      chapters,
    };
  }

  const totalMaybe = row[1]; // Column B may contain total
  const chapterValues = row.slice(2, 26); // C..Z -> indexes 2..25
  const chapters = headerRow.map((chapter, i) => ({
    chapter: chapter || `Chapter ${i + 1}`,
    score: parseFloat(chapterValues[i]) || 0,
  }));

  return {
    name: studentName,
    totalScore: parseFloat(totalMaybe) || undefined,
    chapters,
  };
};

/**
 * Validates Google Sheets configuration
 */
export const validateGoogleSheetsConfig = (): { isValid: boolean; errors: string[] } => {
  const errors: string[] = [];
  
  if (!GOOGLE_SHEETS_API_KEY) {
    errors.push('VITE_GOOGLE_SHEETS_API_KEY is not set');
  }
  
  if (!PLUS_ONE_SHEET_ID) {
    errors.push('VITE_GOOGLE_SHEET_PLUS_ONE_ID is not set');
  }

  if (!PLUS_TWO_SHEET_ID) {
    errors.push('VITE_GOOGLE_SHEET_PLUS_TWO_ID is not set');
  }
  
  return {
    isValid: errors.length === 0,
    errors
  };
};

/**
 * Gets the current configuration status
 */
export const getConfigStatus = () => {
  const validation = validateGoogleSheetsConfig();
  return {
    isConfigured: validation.isValid,
    errors: validation.errors,
    plusOneSheetId: PLUS_ONE_SHEET_ID ? `${PLUS_ONE_SHEET_ID.substring(0, 8)}...` : 'Not set',
    plusTwoSheetId: PLUS_TWO_SHEET_ID ? `${PLUS_TWO_SHEET_ID.substring(0, 8)}...` : 'Not set',
    apiKey: GOOGLE_SHEETS_API_KEY ? `${GOOGLE_SHEETS_API_KEY.substring(0, 8)}...` : 'Not set',
  };
};
