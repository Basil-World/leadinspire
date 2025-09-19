import { Trophy, Medal, Award, Star, TrendingUp } from 'lucide-react';

interface Student {
  id: string;
  name: string;
  totalScore: number;
  weeklyScores: number[];
  rank: number;
  trend: 'up' | 'down' | 'stable';
}

interface LeaderboardTableProps {
  students: Student[];
  searchQuery: string;
}

const LeaderboardTable = ({ students, searchQuery }: LeaderboardTableProps) => {
  const filteredStudents = students.filter(student =>
    student.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const getRankIcon = (rank: number) => {
    switch (rank) {
      case 1:
        return <Trophy className="h-6 w-6 text-yellow-400 glow-stellar" />;
      case 2:
        return <Medal className="h-6 w-6 text-gray-300" />;
      case 3:
        return <Award className="h-6 w-6 text-amber-600" />;
      default:
        return <Star className="h-5 w-5 text-muted-foreground" />;
    }
  };

  const getTrendIcon = (trend: string) => {
    switch (trend) {
      case 'up':
        return <TrendingUp className="h-4 w-4 text-green-400" />;
      case 'down':
        return <TrendingUp className="h-4 w-4 text-red-400 rotate-180" />;
      default:
        return null;
    }
  };

  const getRankStyles = (rank: number) => {
    switch (rank) {
      case 1:
        return 'bg-gradient-to-r from-yellow-500/20 to-amber-500/20 border-yellow-400/30 glow-stellar';
      case 2:
        return 'bg-gradient-to-r from-gray-400/20 to-slate-400/20 border-gray-300/30';
      case 3:
        return 'bg-gradient-to-r from-amber-600/20 to-orange-600/20 border-amber-600/30';
      default:
        return 'glass';
    }
  };

  return (
    <div className="space-y-3 sm:space-y-4">
      {filteredStudents.map((student, index) => (
        <div
          key={student.id}
          className={`${getRankStyles(student.rank)} rounded-xl p-4 sm:p-6 transition-all duration-300 hover:scale-[1.01] sm:hover:scale-[1.02] animate-slide-up`}
          style={{ animationDelay: `${index * 0.1}s` }}
        >
          {/* Mobile Layout */}
          <div className="block sm:hidden">
            {/* Top Row - Rank and Name */}
            <div className="flex items-center gap-3 mb-3">
              <div className="flex items-center gap-2">
                {getRankIcon(student.rank)}
                <span className={`text-xl font-bold ${
                  student.rank <= 3 ? 'text-glow' : ''
                }`}>
                  #{student.rank}
                </span>
              </div>
              <div className="flex-1">
                <h3 className="text-lg font-semibold text-foreground">
                  {student.name}
                </h3>
              </div>
              <div className="text-right">
                <div className="text-2xl font-bold text-primary text-glow">
                  {student.totalScore}
                </div>
                <div className="text-xs text-muted-foreground">
                  Points
                </div>
              </div>
            </div>

            {/* Bottom Row - Weekly Scores */}
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2 text-xs text-muted-foreground">
                <span>Weekly Scores</span>
                {getTrendIcon(student.trend)}
              </div>
              <div className="flex items-center gap-1">
                {student.weeklyScores.map((score, weekIndex) => (
                  <div
                    key={weekIndex}
                    className="glass-intense rounded-md px-2 py-1 text-xs font-medium min-w-[35px] text-center"
                  >
                    {score}
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Desktop Layout */}
          <div className="hidden sm:flex items-center justify-between">
            {/* Rank and Name */}
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-2">
                {getRankIcon(student.rank)}
                <span className={`text-2xl font-bold ${
                  student.rank <= 3 ? 'text-glow' : ''
                }`}>
                  #{student.rank}
                </span>
              </div>
              <div>
                <h3 className="text-xl font-semibold text-foreground">
                  {student.name}
                </h3>
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <span>Total Score: {student.totalScore}</span>
                  {getTrendIcon(student.trend)}
                </div>
              </div>
            </div>

            {/* Weekly Scores */}
            <div className="flex items-center gap-2">
              <span className="text-sm text-muted-foreground mr-2">Weekly:</span>
              {student.weeklyScores.map((score, weekIndex) => (
                <div
                  key={weekIndex}
                  className="glass-intense rounded-lg px-3 py-2 text-sm font-medium min-w-[50px] text-center"
                >
                  {score}
                </div>
              ))}
            </div>

            {/* Total Score Highlight */}
            <div className="text-right">
              <div className="text-3xl font-bold text-primary text-glow">
                {student.totalScore}
              </div>
              <div className="text-xs text-muted-foreground">
                Total Points
              </div>
            </div>
          </div>
        </div>
      ))}

      {filteredStudents.length === 0 && (
        <div className="glass rounded-xl p-12 text-center">
          <Star className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
          <p className="text-lg text-muted-foreground">
            No students found matching "{searchQuery}"
          </p>
        </div>
      )}
    </div>
  );
};

export default LeaderboardTable;