import { Trophy, Medal, Award, Star, TrendingUp } from 'lucide-react';
import { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { fetchStudentChapterDetails, StudentChapterDetails } from '@/services/googleSheetsService';

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
  classType: 'plus-one' | 'plus-two';
}

const LeaderboardTable = ({ students, searchQuery, classType }: LeaderboardTableProps) => {
  const [dialogOpen, setDialogOpen] = useState(false);
  const [loadingDetails, setLoadingDetails] = useState(false);
  const [selectedStudent, setSelectedStudent] = useState<Student | null>(null);
  const [chapterDetails, setChapterDetails] = useState<StudentChapterDetails | null>(null);
  const [detailsError, setDetailsError] = useState<string | null>(null);

  const openStudentDetails = async (student: Student) => {
    setSelectedStudent(student);
    setDialogOpen(true);
    setLoadingDetails(true);
    setDetailsError(null);
    setChapterDetails(null);
    try {
      const details = await fetchStudentChapterDetails(classType, student.name);
      if (!details) {
        setDetailsError('No chapter data found for this student.');
      } else {
        setChapterDetails(details);
      }
    } catch (e) {
      const msg = e instanceof Error ? e.message : 'Failed to load details';
      setDetailsError(msg);
    } finally {
      setLoadingDetails(false);
    }
  };

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
        return 'bg-gray-800/80 border-yellow-400/50 shadow-lg';
      case 2:
        return 'bg-gray-800/60 border-gray-400/50 shadow-md';
      case 3:
        return 'bg-gray-800/60 border-amber-600/50 shadow-md';
      default:
        return 'bg-gray-800/40 border-gray-600/30';
    }
  };

  return (
    <div className="space-y-3 sm:space-y-4">
      {filteredStudents.map((student, index) => (
        <div
          key={student.id}
          className={`${getRankStyles(student.rank)} rounded-xl p-4 sm:p-6 transition-all duration-300 hover:scale-[1.01] sm:hover:scale-[1.02] animate-slide-up border backdrop-blur-sm cursor-pointer`}
          style={{ animationDelay: `${index * 0.1}s` }}
          onClick={() => openStudentDetails(student)}
        >
          {/* Mobile Layout */}
          <div className="block sm:hidden">
            {/* Top Row - Rank, Name and Total */}
            <div className="flex items-center justify-between w-full mb-3">
              <div className="flex items-center gap-4">
                <div className="flex items-center gap-2">
                  {getRankIcon(student.rank)}
                  <span className={`text-xl font-bold ${
                    student.rank <= 3 ? 'text-yellow-400' : 'text-white'
                  }`}>
                    #{student.rank}
                  </span>
                </div>
                <h3 className="text-lg font-semibold text-white">
                  {student.name}
                </h3>
              </div>
              <div className="text-2xl font-bold text-yellow-300">
                {student.totalScore}
              </div>
            </div>

            {/* Bottom Row - Weekly Scores - Hide if all zeros */}
            {student.weeklyScores.some(score => score > 0) && (
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
            )}
          </div>

          {/* Desktop Layout */}
          <div className="hidden sm:flex items-center justify-between">
            {/* Rank, Name, and Total (B column) */}
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-2">
                {getRankIcon(student.rank)}
                <span className={`text-2xl font-bold ${
                  student.rank <= 3 ? 'text-yellow-400' : 'text-white'
                }`}>
                  #{student.rank}
                </span>
              </div>
              <div className="flex items-center justify-between w-full">
                <div className="flex items-center gap-4">
                  <h3 className="text-xl font-semibold text-white">
                    {student.name}
                  </h3>
                  <div className="text-sm text-gray-400">
                    {getTrendIcon(student.trend)}
                  </div>
                </div>
                <div className="text-2xl font-bold text-yellow-300">
                  {student.totalScore}
                </div>
              </div>
            </div>

            {/* Weekly Scores - Hide if all zeros */}
            {student.weeklyScores.some(score => score > 0) && (
              <div className="flex items-center gap-2">
                <span className="text-sm text-gray-400 mr-2">Weekly:</span>
                {student.weeklyScores.map((score, weekIndex) => (
                  <div
                    key={weekIndex}
                    className="bg-gray-700/50 rounded-lg px-3 py-2 text-sm font-medium min-w-[50px] text-center text-white border border-gray-600/30"
                  >
                    {score}
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      ))}

      {filteredStudents.length === 0 && (
        <div className="bg-gray-800/50 rounded-xl p-12 text-center border border-gray-600/30">
          <Star className="h-12 w-12 text-gray-400 mx-auto mb-4" />
          <p className="text-lg text-gray-300">
            No students found matching "{searchQuery}"
          </p>
        </div>
      )}

      {/* Details Dialog */}
      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent className="bg-gray-900 text-white border border-gray-700">
          <DialogHeader>
            <DialogTitle>
              {selectedStudent ? `${selectedStudent.name} — Chapter-wise Marks` : 'Chapter-wise Marks'}
            </DialogTitle>
            <DialogDescription className="text-gray-400">
              {selectedStudent ? `Rank #${selectedStudent.rank} • Total: ${selectedStudent.totalScore}` : ''}
            </DialogDescription>
          </DialogHeader>

          {loadingDetails && (
            <div className="py-6 text-center">
              <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-white mx-auto mb-4"></div>
              <p className="text-gray-300">Loading chapter details…</p>
            </div>
          )}

          {!loadingDetails && detailsError && (
            <div className="py-4 bg-red-500/10 text-red-300 border border-red-500/30 rounded-md px-4">
              {detailsError}
            </div>
          )}

          {!loadingDetails && chapterDetails && (
            <div className="mt-2">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="w-2/3 text-gray-300">Chapter</TableHead>
                    <TableHead className="w-1/3 text-right text-gray-300">Score</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {chapterDetails.chapters.map((c, i) => (
                    <TableRow key={i} className="border-gray-800">
                      <TableCell className="text-white">{c.chapter || `Chapter ${i + 1}`}</TableCell>
                      <TableCell className="text-right font-medium text-yellow-300">{c.score}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default LeaderboardTable;