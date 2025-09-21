import { useState } from 'react';
import { RefreshCw } from 'lucide-react';
import LeaderboardHeader from '@/components/LeaderboardHeader';
import LeaderboardTable from '@/components/LeaderboardTable';
import { Button } from '@/components/ui/button';
import { useGoogleSheets } from '@/hooks/useGoogleSheets';
import { useToast } from '@/hooks/use-toast';

interface Student {
  id: string;
  name: string;
  totalScore: number;
  weeklyScores: number[];
  rank: number;
  trend: 'up' | 'down' | 'stable';
}

const Index = () => {
  const [selectedClass, setSelectedClass] = useState<'plus-one' | 'plus-two'>('plus-one');
  const [searchQuery, setSearchQuery] = useState('');
  const { toast } = useToast();
  
  // Use Google Sheets hook
  const { students, loading, error, refresh, isConfigured } = useGoogleSheets(selectedClass);

  const handleExport = () => {
    if (students.length === 0) {
      toast({
        title: "No data to export",
        description: "Please wait for data to load.",
        variant: "destructive",
      });
      return;
    }

    // Create CSV data
    const csvData = students.map(student => ({
      Rank: student.rank,
      Name: student.name,
      'Total Score': student.totalScore,
      'Week 1': student.weeklyScores[0] || 0,
      'Week 2': student.weeklyScores[1] || 0,
      'Week 3': student.weeklyScores[2] || 0,
      'Week 4': student.weeklyScores[3] || 0,
      'Week 5': student.weeklyScores[4] || 0,
    }));

    const csvContent = [
      Object.keys(csvData[0]).join(','),
      ...csvData.map(row => Object.values(row).join(','))
    ].join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `leaderboard-${selectedClass}-${new Date().toISOString().split('T')[0]}.csv`;
    a.click();
    window.URL.revokeObjectURL(url);

    toast({
      title: "Export successful",
      description: "Leaderboard data has been exported to CSV.",
    });
  };

  const handleRefresh = async () => {
    await refresh();
  };

  return (
    <div className="min-h-screen relative bg-black">
      {/* Clean black background with subtle gradient */}
      <div className="fixed inset-0 z-0 bg-gradient-to-br from-gray-900 via-black to-gray-900" />
      
      {/* Subtle pattern overlay for texture */}
      <div className="fixed inset-0 z-0 opacity-5">
        <div className="absolute inset-0" style={{
          backgroundImage: `radial-gradient(circle at 1px 1px, white 1px, transparent 0)`,
          backgroundSize: '20px 20px'
        }} />
      </div>
      
      {/* Content */}
      <div className="relative z-10 container mx-auto px-3 sm:px-4 lg:px-6 py-4 sm:py-6 lg:py-8">
        <LeaderboardHeader
          selectedClass={selectedClass}
          onClassChange={setSelectedClass}
          searchQuery={searchQuery}
          onSearchChange={setSearchQuery}
          onExport={handleExport}
          onRefresh={handleRefresh}
          isRefreshing={loading}
          isConfigured={isConfigured}
        />

        {!isConfigured ? (
          <div className="bg-gray-800/50 rounded-xl p-8 sm:p-12 text-center border border-gray-600/30">
            <div className="text-red-400 text-6xl mb-4">⚠️</div>
            <h2 className="text-2xl font-bold text-white mb-4">Google Sheets Not Configured</h2>
            <p className="text-gray-300 mb-6">
              Please set up your Google Sheets API credentials to load leaderboard data.
            </p>
            <div className="bg-gray-700/50 rounded-lg p-4 text-left max-w-2xl mx-auto border border-gray-600/30">
              <h3 className="font-semibold mb-2 text-white">Required Environment Variables:</h3>
              <ul className="text-sm space-y-1 text-gray-300">
                <li>• <code className="bg-gray-800 px-2 py-1 rounded text-gray-200">VITE_GOOGLE_SHEETS_API_KEY</code></li>
                <li>• <code className="bg-gray-800 px-2 py-1 rounded text-gray-200">VITE_GOOGLE_SHEET_PLUS_ONE_ID</code></li>
                <li>• <code className="bg-gray-800 px-2 py-1 rounded text-gray-200">VITE_GOOGLE_SHEET_PLUS_TWO_ID</code></li>
                <li>• <code className="bg-gray-800 px-2 py-1 rounded text-gray-200">VITE_GOOGLE_SHEET_PLUS_ONE_RANGE</code> (optional)</li>
                <li>• <code className="bg-gray-800 px-2 py-1 rounded text-gray-200">VITE_GOOGLE_SHEET_PLUS_TWO_RANGE</code> (optional)</li>
              </ul>
            </div>
          </div>
        ) : error ? (
          <div className="bg-gray-800/50 rounded-xl p-8 sm:p-12 text-center border border-gray-600/30">
            <div className="text-red-400 text-6xl mb-4">❌</div>
            <h2 className="text-2xl font-bold text-white mb-4">Error Loading Data</h2>
            <p className="text-gray-300 mb-6">{error}</p>
            <Button onClick={handleRefresh} className="bg-white text-black hover:bg-gray-200">
              <RefreshCw className="h-4 w-4 mr-2" />
              Try Again
            </Button>
          </div>
        ) : loading ? (
          <div className="bg-gray-800/50 rounded-xl p-8 sm:p-12 text-center animate-pulse border border-gray-600/30">
            <div className="animate-spin rounded-full h-10 w-10 sm:h-12 sm:w-12 border-b-2 border-white mx-auto mb-4"></div>
            <p className="text-base sm:text-lg text-gray-300">Loading leaderboard data...</p>
          </div>
        ) : students.length === 0 && selectedClass === 'plus-two' ? (
          <div className="bg-gray-800/50 rounded-xl p-8 sm:p-12 text-center border border-gray-600/30">
            <div className="text-blue-400 text-6xl mb-4">📚</div>
            <h2 className="text-2xl font-bold text-white mb-4">Plus Two Exam Not Started</h2>
            <p className="text-gray-300 mb-6">
              The Plus Two examination has not started yet. Check back later for the leaderboard.
            </p>
            <Button 
              onClick={() => setSelectedClass('plus-one')} 
              className="bg-white text-black hover:bg-gray-200"
            >
              View Plus One Leaderboard
            </Button>
          </div>
        ) : (
          <LeaderboardTable
            students={students}
            searchQuery={searchQuery}
          />
        )}

        {/* Footer */}
        <div className="mt-12 sm:mt-16 text-center px-4">
          <p className="text-xs sm:text-sm text-gray-400">
            Last updated: {new Date().toLocaleString()}
          </p>
          <p className="text-xs text-gray-500 mt-2">
            {isConfigured 
              ? "Data synchronized" 
              : "Configure Google Sheets API to load live data"
            }
          </p>
        </div>
      </div>
    </div>
  );
};

export default Index;
