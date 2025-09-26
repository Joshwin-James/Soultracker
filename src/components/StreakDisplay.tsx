import React from 'react';
import { Flame } from 'lucide-react';

interface StreakDisplayProps {
  streak: number;
  className?: string;
}

export default function StreakDisplay({ streak, className = '' }: StreakDisplayProps) {
  const getStreakColor = (streak: number) => {
    if (streak >= 30) return 'text-orange-400';
    if (streak >= 14) return 'text-yellow-400';
    if (streak >= 7) return 'text-green-400';
    return 'text-blue-400';
  };

  return (
    <div className={`text-center ${className}`}>
      <div className="inline-flex items-center space-x-2 bg-gray-800 rounded-xl px-6 py-4 shadow-lg">
        <Flame className={`h-8 w-8 ${getStreakColor(streak)}`} />
        <div className="text-left">
          <p className="text-2xl font-bold text-white">{streak}</p>
          <p className="text-sm text-gray-400">Day Streak</p>
        </div>
      </div>
    </div>
  );
}