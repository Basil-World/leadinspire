import { useState } from 'react';
import { RefreshCw } from 'lucide-react';
import Starfield from '@/components/Starfield';
import LeaderboardHeader from '@/components/LeaderboardHeader';
import LeaderboardTable from '@/components/LeaderboardTable';
import { Button } from '@/components/ui/button';
import { useGoogleSheets } from '@/hooks/useGoogleSheets';
import { useToast } from '@/hooks/use-toast';
import starfieldBgDark from '@/assets/starfield-bg-dark.jpg';

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
        description: "Please wait for data to load or check your Google Sheets configuration.",
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
    <div className="min-h-screen relative">
      {/* Background */}
      <div 
        className="fixed inset-0 z-0"
        style={{
          backgroundImage: `url(${starfieldBgDark})`,
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          backgroundRepeat: 'no-repeat',
        }}
      />
      <Starfield />
      
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
          <div className="glass rounded-xl p-8 sm:p-12 text-center">
            <div className="text-red-400 text-6xl mb-4">⚠️</div>
            <h2 className="text-2xl font-bold text-foreground mb-4">Google Sheets Not Configured</h2>
            <p className="text-muted-foreground mb-6">
              Please set up your Google Sheets API credentials to load leaderboard data.
            </p>
            <div className="bg-muted/50 rounded-lg p-4 text-left max-w-2xl mx-auto">
              <h3 className="font-semibold mb-2">Required Environment Variables:</h3>
              <ul className="text-sm space-y-1">
                <li>• <code className="bg-background px-2 py-1 rounded">VITE_GOOGLE_SHEETS_API_KEY</code></li>
                <li>• <code className="bg-background px-2 py-1 rounded">VITE_GOOGLE_SHEET_ID</code></li>
                <li>• <code className="bg-background px-2 py-1 rounded">VITE_GOOGLE_SHEET_PLUS_ONE_RANGE</code> (optional)</li>
                <li>• <code className="bg-background px-2 py-1 rounded">VITE_GOOGLE_SHEET_PLUS_TWO_RANGE</code> (optional)</li>
              </ul>
            </div>
          </div>
        ) : error ? (
          <div className="glass rounded-xl p-8 sm:p-12 text-center">
            <div className="text-red-400 text-6xl mb-4">❌</div>
            <h2 className="text-2xl font-bold text-foreground mb-4">Error Loading Data</h2>
            <p className="text-muted-foreground mb-6">{error}</p>
            <Button onClick={handleRefresh} className="glow-stellar">
              <RefreshCw className="h-4 w-4 mr-2" />
              Try Again
            </Button>
          </div>
        ) : loading ? (
          <div className="glass rounded-xl p-8 sm:p-12 text-center animate-glow-pulse">
            <div className="animate-spin rounded-full h-10 w-10 sm:h-12 sm:w-12 border-b-2 border-primary mx-auto mb-4"></div>
            <p className="text-base sm:text-lg text-muted-foreground">Loading leaderboard data from Google Sheets...</p>
          </div>
        ) : students.length === 0 && selectedClass === 'plus-two' ? (
          <div className="glass rounded-xl p-8 sm:p-12 text-center">
            <div className="text-blue-400 text-6xl mb-4">📚</div>
            <h2 className="text-2xl font-bold text-foreground mb-4">Plus Two Exam Not Started</h2>
            <p className="text-muted-foreground mb-6">
              The Plus Two examination has not started yet. Check back later for the leaderboard.
            </p>
            <Button 
              onClick={() => setSelectedClass('plus-one')} 
              className="glow-stellar"
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
          <p className="text-xs sm:text-sm text-muted-foreground">
            Last updated: {new Date().toLocaleString()}
          </p>
          <p className="text-xs text-muted-foreground mt-2">
            {isConfigured 
              ? "Data synchronized from Google Sheets" 
              : "Configure Google Sheets API to load live data"
            }
          </p>
        </div>
      </div>
    </div>
  );
};

export default Index;
