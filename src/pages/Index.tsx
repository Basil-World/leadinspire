import { useState, useEffect } from 'react';
import Starfield from '@/components/Starfield';
import LeaderboardHeader from '@/components/LeaderboardHeader';
import LeaderboardTable from '@/components/LeaderboardTable';
import { getLeaderboardData } from '@/data/mockLeaderboardData';
import { useToast } from '@/hooks/use-toast';
import starfieldBg from '@/assets/starfield-bg.jpg';

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
  const [students, setStudents] = useState<Student[]>([]);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  useEffect(() => {
    const loadLeaderboardData = async () => {
      setLoading(true);
      try {
        const data = await getLeaderboardData(selectedClass) as Student[];
        setStudents(data);
      } catch (error) {
        toast({
          title: "Error loading data",
          description: "Failed to load leaderboard data. Please try again.",
          variant: "destructive",
        });
      } finally {
        setLoading(false);
      }
    };

    loadLeaderboardData();
  }, [selectedClass, toast]);

  const handleExport = () => {
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

  return (
    <div className="min-h-screen relative">
      {/* Background */}
      <div 
        className="fixed inset-0 z-0"
        style={{
          backgroundImage: `url(${starfieldBg})`,
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          backgroundRepeat: 'no-repeat',
        }}
      />
      <Starfield />
      
      {/* Content */}
      <div className="relative z-10 container mx-auto px-4 py-8">
        <LeaderboardHeader
          selectedClass={selectedClass}
          onClassChange={setSelectedClass}
          searchQuery={searchQuery}
          onSearchChange={setSearchQuery}
          onExport={handleExport}
        />

        {loading ? (
          <div className="glass rounded-xl p-12 text-center animate-glow-pulse">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
            <p className="text-lg text-muted-foreground">Loading leaderboard data...</p>
          </div>
        ) : (
          <LeaderboardTable
            students={students}
            searchQuery={searchQuery}
          />
        )}

        {/* Footer */}
        <div className="mt-16 text-center">
          <p className="text-sm text-muted-foreground">
            Last updated: {new Date().toLocaleString()}
          </p>
          <p className="text-xs text-muted-foreground mt-2">
            Data will be automatically synchronized from Google Sheets once backend is connected
          </p>
        </div>
      </div>
    </div>
  );
};

export default Index;
