// Mock data structure matching the expected Google Sheets format
export const mockLeaderboardData = {
  'plus-one': [
    {
      id: '1',
      name: 'Arjun Sharma',
      weeklyScores: [95, 88, 92, 97, 85],
      totalScore: 457,
      rank: 1,
      trend: 'up' as const,
    },
    {
      id: '2',
      name: 'Priya Patel',
      weeklyScores: [91, 94, 89, 88, 90],
      totalScore: 452,
      rank: 2,
      trend: 'stable' as const,
    },
    {
      id: '3',
      name: 'Rohan Kumar',
      weeklyScores: [87, 91, 95, 85, 92],
      totalScore: 450,
      rank: 3,
      trend: 'up' as const,
    },
    {
      id: '4',
      name: 'Sneha Reddy',
      weeklyScores: [89, 87, 91, 89, 88],
      totalScore: 444,
      rank: 4,
      trend: 'stable' as const,
    },
    {
      id: '5',
      name: 'Vikram Singh',
      weeklyScores: [92, 85, 87, 91, 89],
      totalScore: 444,
      rank: 4, // Tied with Sneha
      trend: 'down' as const,
    },
    {
      id: '6',
      name: 'Ananya Gupta',
      weeklyScores: [84, 89, 88, 86, 94],
      totalScore: 441,
      rank: 6,
      trend: 'up' as const,
    },
    {
      id: '7',
      name: 'Karthik Iyer',
      weeklyScores: [88, 82, 90, 87, 89],
      totalScore: 436,
      rank: 7,
      trend: 'stable' as const,
    },
    {
      id: '8',
      name: 'Meera Joshi',
      weeklyScores: [81, 88, 85, 89, 91],
      totalScore: 434,
      rank: 8,
      trend: 'up' as const,
    },
  ],
  'plus-two': [
    {
      id: '9',
      name: 'Aditya Verma',
      weeklyScores: [98, 95, 94, 96, 92],
      totalScore: 475,
      rank: 1,
      trend: 'up' as const,
    },
    {
      id: '10',
      name: 'Kavya Nair',
      weeklyScores: [94, 97, 91, 93, 95],
      totalScore: 470,
      rank: 2,
      trend: 'stable' as const,
    },
    {
      id: '11',
      name: 'Rahul Menon',
      weeklyScores: [91, 89, 96, 94, 97],
      totalScore: 467,
      rank: 3,
      trend: 'up' as const,
    },
    {
      id: '12',
      name: 'Ishita Bansal',
      weeklyScores: [89, 92, 88, 95, 91],
      totalScore: 455,
      rank: 4,
      trend: 'down' as const,
    },
    {
      id: '13',
      name: 'Siddharth Roy',
      weeklyScores: [87, 90, 93, 89, 94],
      totalScore: 453,
      rank: 5,
      trend: 'up' as const,
    },
    {
      id: '14',
      name: 'Aadhya Sinha',
      weeklyScores: [93, 86, 89, 91, 88],
      totalScore: 447,
      rank: 6,
      trend: 'down' as const,
    },
    {
      id: '15',
      name: 'Nikhil Agarwal',
      weeklyScores: [85, 88, 87, 92, 93],
      totalScore: 445,
      rank: 7,
      trend: 'up' as const,
    },
    {
      id: '16',
      name: 'Riya Kapoor',
      weeklyScores: [88, 84, 91, 86, 89],
      totalScore: 438,
      rank: 8,
      trend: 'stable' as const,
    },
  ],
};

// Function to simulate API response
export const getLeaderboardData = (classType: 'plus-one' | 'plus-two') => {
  return new Promise((resolve) => {
    // Simulate API delay
    setTimeout(() => {
      resolve(mockLeaderboardData[classType]);
    }, 500);
  });
};