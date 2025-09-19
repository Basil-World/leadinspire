import { Search, Download, ToggleLeft, ToggleRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';

interface LeaderboardHeaderProps {
  selectedClass: 'plus-one' | 'plus-two';
  onClassChange: (classType: 'plus-one' | 'plus-two') => void;
  searchQuery: string;
  onSearchChange: (query: string) => void;
  onExport: () => void;
}

const LeaderboardHeader = ({
  selectedClass,
  onClassChange,
  searchQuery,
  onSearchChange,
  onExport,
}: LeaderboardHeaderProps) => {
  return (
    <div className="glass rounded-2xl p-8 mb-8 animate-slide-up">
      {/* Title Section */}
      <div className="text-center mb-8">
        <h1 className="text-5xl font-bold text-glow mb-4">
          Inspire The Pioneer
        </h1>
        <p className="text-xl text-muted-foreground">
          Weekly Examination Leaderboard
        </p>
      </div>

      {/* Controls Section */}
      <div className="flex flex-col lg:flex-row gap-6 items-center justify-between">
        {/* Class Toggle */}
        <div className="flex items-center gap-4">
          <span className="text-sm font-medium">Class:</span>
          <div className="glass-intense rounded-full p-2 flex items-center gap-2">
            <Button
              variant={selectedClass === 'plus-one' ? 'default' : 'ghost'}
              size="sm"
              onClick={() => onClassChange('plus-one')}
              className={`rounded-full transition-all ${
                selectedClass === 'plus-one' 
                  ? 'bg-primary text-primary-foreground glow-blue' 
                  : 'hover:bg-secondary'
              }`}
            >
              {selectedClass === 'plus-one' ? <ToggleRight className="h-4 w-4 mr-2" /> : <ToggleLeft className="h-4 w-4 mr-2" />}
              Plus One
            </Button>
            <Button
              variant={selectedClass === 'plus-two' ? 'default' : 'ghost'}
              size="sm"
              onClick={() => onClassChange('plus-two')}
              className={`rounded-full transition-all ${
                selectedClass === 'plus-two' 
                  ? 'bg-primary text-primary-foreground glow-blue' 
                  : 'hover:bg-secondary'
              }`}
            >
              {selectedClass === 'plus-two' ? <ToggleRight className="h-4 w-4 mr-2" /> : <ToggleLeft className="h-4 w-4 mr-2" />}
              Plus Two
            </Button>
          </div>
        </div>

        {/* Search and Export */}
        <div className="flex items-center gap-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
            <Input
              placeholder="Search students..."
              value={searchQuery}
              onChange={(e) => onSearchChange(e.target.value)}
              className="pl-10 w-64 glass-intense border-border"
            />
          </div>
          <Button
            variant="outline"
            size="sm"
            onClick={onExport}
            className="glass-intense border-border hover:glow-stellar"
          >
            <Download className="h-4 w-4 mr-2" />
            Export
          </Button>
        </div>
      </div>
    </div>
  );
};

export default LeaderboardHeader;