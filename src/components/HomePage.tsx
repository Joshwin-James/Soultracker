import React, { useState, useEffect } from 'react';
import { Send, Loader2 } from 'lucide-react';
import { useApi } from '../hooks/useApi';
import { submitJournalEntry, fetchLeaderboard } from '../services/api';
import { JournalResponse } from '../types';
import MoodIndicator from './MoodIndicator';
import StreakDisplay from './StreakDisplay';

export default function HomePage() {
  const [journalText, setJournalText] = useState('');
  const [submittedMood, setSubmittedMood] = useState<string | null>(null);
  const [currentStreak, setCurrentStreak] = useState(0);
  
  const submitApi = useApi<JournalResponse>(submitJournalEntry);
  const leaderboardApi = useApi(fetchLeaderboard);

  useEffect(() => {
    const loadStreak = async () => {
      const result = await leaderboardApi.execute();
      if (result) {
        setCurrentStreak(result.current_user_streak);
      }
    };
    
    loadStreak();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!journalText.trim()) {
      return;
    }

    const result = await submitApi.execute({ text: journalText });
    
    if (result) {
      setSubmittedMood(result.mood_color);
      setJournalText('');
      
      // Refresh streak after successful submission
      const leaderboardResult = await leaderboardApi.execute();
      if (leaderboardResult) {
        setCurrentStreak(leaderboardResult.current_user_streak);
      }
    }
  };

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Header */}
      <div className="text-center mb-12">
        <h1 className="text-4xl md:text-5xl font-bold text-white mb-4">
          MindFlow: The Consistency Quest
        </h1>
        <p className="text-xl text-gray-400">
          Your daily journey towards mindful reflection and personal growth
        </p>
      </div>

      {/* Streak Display */}
      <StreakDisplay streak={currentStreak} className="mb-12" />

      {/* Journal Entry Form */}
      <div className="bg-gray-800 rounded-2xl shadow-2xl p-8 mb-8">
        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label htmlFor="journal-entry" className="block text-lg font-medium text-white mb-4">
              How was your day? Share your thoughts...
            </label>
            <textarea
              id="journal-entry"
              value={journalText}
              onChange={(e) => setJournalText(e.target.value)}
              placeholder="Write about your experiences, feelings, goals, or anything on your mind..."
              className="w-full h-48 px-4 py-3 bg-gray-700 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none transition-all duration-200"
              disabled={submitApi.loading}
            />
          </div>
          
          <button
            type="submit"
            disabled={submitApi.loading || !journalText.trim()}
            className="w-full bg-blue-600 hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed text-white font-semibold py-4 px-6 rounded-lg transition-all duration-200 flex items-center justify-center space-x-2 shadow-lg hover:shadow-xl"
          >
            {submitApi.loading ? (
              <Loader2 className="h-5 w-5 animate-spin" />
            ) : (
              <Send className="h-5 w-5" />
            )}
            <span>{submitApi.loading ? 'Analyzing...' : 'Submit Entry'}</span>
          </button>
        </form>

        {/* Error Display */}
        {submitApi.error && (
          <div className="mt-6 p-4 bg-red-900/50 border border-red-700 rounded-lg">
            <p className="text-red-400 text-center">
              {submitApi.error.message}
            </p>
          </div>
        )}

        {/* Success Feedback */}
        {submittedMood && !submitApi.loading && (
          <div className="mt-8 p-6 bg-gray-700 rounded-lg border border-gray-600">
            <div className="text-center">
              <h3 className="text-lg font-semibold text-white mb-4">
                Entry Submitted Successfully! 🎉
              </h3>
              <MoodIndicator moodColor={submittedMood} className="justify-center" />
            </div>
          </div>
        )}
      </div>

      {/* Loading state for streak */}
      {leaderboardApi.loading && (
        <div className="text-center text-gray-400">
          <Loader2 className="h-6 w-6 animate-spin mx-auto mb-2" />
          <p>Loading your progress...</p>
        </div>
      )}
    </div>
  );
}