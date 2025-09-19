import { Student } from '../services/googleSheetsService';

/**
 * Transforms raw Google Sheets data into Student objects
 */
export const transformSheetsDataToStudents = (
  rawData: any[][],
  classType: 'plus-one' | 'plus-two'
): Student[] => {
  if (!rawData || rawData.length === 0) {
    return [];
  }

  // Skip header row and process data
  const dataRows = rawData.slice(1);
  
  const students: Student[] = dataRows
    .map((row, index) => {
      try {
        // Expected format: [Name, Week1, Week2, Week3, Week4, Week5, TotalScore]
        const [name, week1, week2, week3, week4, week5, totalScore] = row;
        
        if (!name || name.toString().trim() === '') {
          return null; // Skip empty rows
        }
        
        const weeklyScores = [
          parseFloat(week1) || 0,
          parseFloat(week2) || 0,
          parseFloat(week3) || 0,
          parseFloat(week4) || 0,
          parseFloat(week5) || 0,
        ];
        
        const total = parseFloat(totalScore) || weeklyScores.reduce((sum, score) => sum + score, 0);
        
        return {
          id: `${classType}-${index + 1}`,
          name: name.toString().trim(),
          weeklyScores,
          totalScore: Math.round(total),
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

  // Calculate trends based on weekly score progression
  students.forEach(student => {
    student.trend = calculateTrend(student.weeklyScores);
  });

  return students;
};

/**
 * Calculates trend based on weekly scores
 */
const calculateTrend = (weeklyScores: number[]): 'up' | 'down' | 'stable' => {
  if (weeklyScores.length < 2) {
    return 'stable';
  }

  // Get the last two non-zero scores for trend calculation
  const nonZeroScores = weeklyScores.filter(score => score > 0);
  
  if (nonZeroScores.length < 2) {
    return 'stable';
  }

  const recent = nonZeroScores.slice(-2);
  const [secondLast, last] = recent;

  if (last > secondLast) {
    return 'up';
  } else if (last < secondLast) {
    return 'down';
  } else {
    return 'stable';
  }
};

/**
 * Validates student data structure
 */
export const validateStudentData = (students: Student[]): { isValid: boolean; errors: string[] } => {
  const errors: string[] = [];

  students.forEach((student, index) => {
    if (!student.name || student.name.trim() === '') {
      errors.push(`Student at index ${index} has no name`);
    }

    if (student.totalScore < 0) {
      errors.push(`Student ${student.name} has negative total score`);
    }

    if (student.weeklyScores.length !== 5) {
      errors.push(`Student ${student.name} does not have exactly 5 weekly scores`);
    }

    if (student.weeklyScores.some(score => score < 0)) {
      errors.push(`Student ${student.name} has negative weekly scores`);
    }

    if (student.rank < 1) {
      errors.push(`Student ${student.name} has invalid rank`);
    }
  });

  return {
    isValid: errors.length === 0,
    errors,
  };
};

/**
 * Sorts students by rank
 */
export const sortStudentsByRank = (students: Student[]): Student[] => {
  return [...students].sort((a, b) => a.rank - b.rank);
};

/**
 * Filters students by search query
 */
export const filterStudentsByName = (students: Student[], searchQuery: string): Student[] => {
  if (!searchQuery.trim()) {
    return students;
  }

  const query = searchQuery.toLowerCase().trim();
  return students.filter(student =>
    student.name.toLowerCase().includes(query)
  );
};
