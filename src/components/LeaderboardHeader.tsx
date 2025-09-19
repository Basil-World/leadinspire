import { Search, Download, ToggleLeft, ToggleRight, RefreshCw } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';

interface LeaderboardHeaderProps {
  selectedClass: 'plus-one' | 'plus-two';
  onClassChange: (classType: 'plus-one' | 'plus-two') => void;
  searchQuery: string;
  onSearchChange: (query: string) => void;
  onExport: () => void;
  onRefresh?: () => void;
  isRefreshing?: boolean;
  isConfigured?: boolean;
}

const LeaderboardHeader = ({
  selectedClass,
  onClassChange,
  searchQuery,
  onSearchChange,
  onExport,
  onRefresh,
  isRefreshing = false,
  isConfigured = true,
}: LeaderboardHeaderProps) => {
  return (
    <div className="bg-gray-900/50 backdrop-blur-sm rounded-2xl p-4 sm:p-6 lg:p-8 mb-6 sm:mb-8 animate-slide-up border border-gray-700/50 shadow-2xl">
      {/* Title Section */}
      <div className="text-center mb-6 sm:mb-8">
        <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold mb-2 sm:mb-4 text-white">
          Inspire The Pioneer
        </h1>
        <p className="text-lg sm:text-xl text-gray-300 font-medium">
          Weekly Examination Leaderboard
        </p>
        <div className="w-24 h-1 bg-white mx-auto mt-4 rounded-full"></div>
      </div>

      {/* Controls Section */}
      <div className="flex flex-col space-y-4 lg:flex-row lg:space-y-0 lg:gap-6 lg:items-center lg:justify-between">
        {/* Class Toggle */}
        <div className="flex flex-col sm:flex-row sm:items-center gap-3 sm:gap-4 w-full lg:w-auto">
          <span className="text-sm font-semibold text-center sm:text-left text-white">Class:</span>
          <div className="bg-gray-800/50 rounded-full p-2 flex items-center gap-1 sm:gap-2 justify-center border border-gray-600/50">
            <Button
              variant={selectedClass === 'plus-one' ? 'default' : 'ghost'}
              size="sm"
              onClick={() => onClassChange('plus-one')}
              className={`rounded-full transition-all duration-300 text-xs sm:text-sm font-medium ${
                selectedClass === 'plus-one' 
                  ? 'bg-white text-black shadow-lg' 
                  : 'text-gray-300 hover:bg-gray-700/50 hover:text-white'
              }`}
            >
              {selectedClass === 'plus-one' ? <ToggleRight className="h-3 w-3 sm:h-4 sm:w-4 mr-1 sm:mr-2" /> : <ToggleLeft className="h-3 w-3 sm:h-4 sm:w-4 mr-1 sm:mr-2" />}
              Plus One
            </Button>
            <Button
              variant={selectedClass === 'plus-two' ? 'default' : 'ghost'}
              size="sm"
              onClick={() => onClassChange('plus-two')}
              className={`rounded-full transition-all duration-300 text-xs sm:text-sm font-medium ${
                selectedClass === 'plus-two' 
                  ? 'bg-white text-black shadow-lg' 
                  : 'text-gray-300 hover:bg-gray-700/50 hover:text-white'
              }`}
            >
              {selectedClass === 'plus-two' ? <ToggleRight className="h-3 w-3 sm:h-4 sm:w-4 mr-1 sm:mr-2" /> : <ToggleLeft className="h-3 w-3 sm:h-4 sm:w-4 mr-1 sm:mr-2" />}
              Plus Two
            </Button>
          </div>
        </div>

        {/* Search and Actions */}
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 sm:gap-4 w-full lg:w-auto">
          <div className="relative flex-1 sm:flex-none">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
            <Input
              placeholder="Search students..."
              value={searchQuery}
              onChange={(e) => onSearchChange(e.target.value)}
              className="pl-10 w-full sm:w-64 bg-gray-800/50 border-gray-600/50 text-white placeholder-gray-400 focus:border-white/50 focus:ring-2 focus:ring-white/20 transition-all duration-300"
            />
          </div>
          <div className="flex gap-2 w-full sm:w-auto">
            {onRefresh && (
              <Button
                variant="outline"
                size="sm"
                onClick={onRefresh}
                disabled={isRefreshing || !isConfigured}
                className="bg-gray-800/50 border-gray-600/50 text-white hover:bg-gray-700/50 hover:border-gray-500/50 flex-1 sm:flex-none transition-all duration-300 disabled:opacity-50"
              >
                <RefreshCw className={`h-4 w-4 mr-2 ${isRefreshing ? 'animate-spin' : ''}`} />
                {isRefreshing ? 'Refreshing...' : 'Refresh'}
              </Button>
            )}
            <Button
              variant="outline"
              size="sm"
              onClick={onExport}
              disabled={!isConfigured}
              className="bg-gray-800/50 border-gray-600/50 text-white hover:bg-gray-700/50 hover:border-gray-500/50 flex-1 sm:flex-none transition-all duration-300 disabled:opacity-50"
            >
              <Download className="h-4 w-4 mr-2" />
              Export
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LeaderboardHeader;