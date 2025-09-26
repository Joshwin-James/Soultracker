import React, { useEffect } from 'react';
import { Trophy, Medal, Award, Loader2, RefreshCw } from 'lucide-react';
import { useApi } from '../hooks/useApi';
import { fetchLeaderboard } from '../services/api';

export default function Leaderboard() {
  const leaderboardApi = useApi(fetchLeaderboard);

  useEffect(() => {
    leaderboardApi.execute();
  }, []);

  const handleRefresh = () => {
    leaderboardApi.execute();
  };

  const getRankIcon = (position: number) => {
    switch (position) {
      case 1:
        return <Trophy className="h-6 w-6 text-yellow-400" />;
      case 2:
        return <Medal className="h-6 w-6 text-gray-300" />;
      case 3:
        return <Award className="h-6 w-6 text-orange-400" />;
      default:
        return <span className="w-6 h-6 flex items-center justify-center text-gray-400 font-bold">#{position}</span>;
    }
  };

  const getRowStyle = (position: number) => {
    if (position <= 3) {
      return 'bg-gradient-to-r from-gray-800 to-gray-700 border-2 border-yellow-500/30';
    }
    return 'bg-gray-800 hover:bg-gray-750';
  };

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Header */}
      <div className="text-center mb-12">
        <h1 className="text-4xl md:text-5xl font-bold text-white mb-4">
          Global Consistency Leaders
        </h1>
        <p className="text-xl text-gray-400 mb-8">
          See how you stack up against other mindful journalers
        </p>
        
        <button
          onClick={handleRefresh}
          disabled={leaderboardApi.loading}
          className="inline-flex items-center space-x-2 bg-blue-600 hover:bg-blue-700 disabled:opacity-50 text-white font-medium py-2 px-4 rounded-lg transition-all duration-200"
        >
          <RefreshCw className={`h-4 w-4 ${leaderboardApi.loading ? 'animate-spin' : ''}`} />
          <span>Refresh</span>
        </button>
      </div>

      {/* Loading State */}
      {leaderboardApi.loading && !leaderboardApi.data && (
        <div className="text-center py-16">
          <Loader2 className="h-12 w-12 animate-spin text-blue-400 mx-auto mb-4" />
          <p className="text-xl text-gray-400">Loading leaderboard...</p>
        </div>
      )}

      {/* Error State */}
      {leaderboardApi.error && (
        <div className="bg-red-900/50 border border-red-700 rounded-lg p-8 text-center">
          <p className="text-red-400 text-lg mb-4">
            Unable to load leaderboard data
          </p>
          <p className="text-red-300 text-sm">
            {leaderboardApi.error.message}
          </p>
          <button
            onClick={handleRefresh}
            className="mt-4 bg-red-600 hover:bg-red-700 text-white font-medium py-2 px-4 rounded-lg transition-colors"
          >
            Try Again
          </button>
        </div>
      )}

      {/* Leaderboard Table */}
      {leaderboardApi.data && (
        <div className="bg-gray-800 rounded-2xl shadow-2xl overflow-hidden">
          <div className="bg-gradient-to-r from-blue-600 to-purple-600 px-6 py-4">
            <h2 className="text-2xl font-bold text-white text-center">
              Top 10 Consistency Champions
            </h2>
          </div>
          
          <div className="divide-y divide-gray-700">
            {leaderboardApi.data.top_10.map((user, index) => {
              const position = index + 1;
              return (
                <div
                  key={`${user.user}-${position}`}
                  className={`${getRowStyle(position)} px-6 py-5 transition-all duration-200`}
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-4">
                      <div className="flex-shrink-0">
                        {getRankIcon(position)}
                      </div>
                      <div>
                        <p className="text-lg font-semibold text-white">
                          {user.user}
                        </p>
                        {position <= 3 && (
                          <p className="text-sm text-gray-400">
                            {position === 1 ? '🏆 Champion' : position === 2 ? '🥈 Runner-up' : '🥉 Third Place'}
                          </p>
                        )}
                      </div>
                    </div>
                    
                    <div className="text-right">
                      <p className="text-2xl font-bold text-white">
                        {user.streak}
                      </p>
                      <p className="text-sm text-gray-400">
                        {user.streak === 1 ? 'day' : 'days'}
                      </p>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
          
          {leaderboardApi.data.top_10.length === 0 && (
            <div className="px-6 py-12 text-center">
              <p className="text-gray-400 text-lg">
                No leaderboard data available yet.
              </p>
              <p className="text-gray-500 text-sm mt-2">
                Be the first to start your consistency journey!
              </p>
            </div>
          )}
        </div>
      )}
      
      {/* Current User Streak */}
      {leaderboardApi.data && (
        <div className="mt-8 bg-gray-800 rounded-xl p-6 text-center">
          <h3 className="text-lg font-semibold text-white mb-2">Your Current Streak</h3>
          <div className="inline-flex items-center space-x-2">
            <div className="text-3xl font-bold text-blue-400">
              {leaderboardApi.data.current_user_streak}
            </div>
            <div className="text-gray-400">
              {leaderboardApi.data.current_user_streak === 1 ? 'day' : 'days'}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}