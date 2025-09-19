// Google Sheets Configuration
export const GOOGLE_SHEETS_CONFIG = {
  // API Configuration
  API_KEY: import.meta.env.VITE_GOOGLE_SHEETS_API_KEY,
  SHEET_ID: import.meta.env.VITE_GOOGLE_SHEET_ID,
  
  // Sheet Ranges
  RANGES: {
    PLUS_ONE: import.meta.env.VITE_GOOGLE_SHEET_PLUS_ONE_RANGE || 'Plus One!A1:F20',
    PLUS_TWO: import.meta.env.VITE_GOOGLE_SHEET_PLUS_TWO_RANGE || 'Plus Two!A1:F20',
  },
  
  // Expected column structure
  COLUMNS: {
    NAME: 0,
    WEEK_1: 1,
    WEEK_2: 2,
    WEEK_3: 3,
    WEEK_4: 4,
    WEEK_5: 5,
    TOTAL_SCORE: 6,
  },
  
  // Cache settings
  CACHE_DURATION: 5 * 60 * 1000, // 5 minutes in milliseconds
} as const;

// Validation function
export const validateConfig = () => {
  const errors: string[] = [];
  
  if (!GOOGLE_SHEETS_CONFIG.API_KEY) {
    errors.push('Google Sheets API Key is not configured');
  }
  
  if (!GOOGLE_SHEETS_CONFIG.SHEET_ID) {
    errors.push('Google Sheet ID is not configured');
  }
  
  return {
    isValid: errors.length === 0,
    errors,
  };
};

// Helper function to get sheet range for class type
export const getSheetRange = (classType: 'plus-one' | 'plus-two'): string => {
  return classType === 'plus-one' 
    ? GOOGLE_SHEETS_CONFIG.RANGES.PLUS_ONE 
    : GOOGLE_SHEETS_CONFIG.RANGES.PLUS_TWO;
};
