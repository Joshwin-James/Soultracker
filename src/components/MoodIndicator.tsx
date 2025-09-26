import React from 'react';

interface MoodIndicatorProps {
  moodColor: string;
  className?: string;
}

const getMoodInfo = (color: string) => {
  switch (color.toLowerCase()) {
    case '#28a745':
    case 'green':
      return { name: 'Positive', bgColor: 'bg-green-500', textColor: 'text-green-400' };
    case '#ffc107':
    case 'yellow':
      return { name: 'Neutral', bgColor: 'bg-yellow-500', textColor: 'text-yellow-400' };
    case '#dc3545':
    case 'red':
      return { name: 'Challenging', bgColor: 'bg-red-500', textColor: 'text-red-400' };
    default:
      return { name: 'Unknown', bgColor: 'bg-gray-500', textColor: 'text-gray-400' };
  }
};

export default function MoodIndicator({ moodColor, className = '' }: MoodIndicatorProps) {
  const mood = getMoodInfo(moodColor);
  
  return (
    <div className={`flex items-center space-x-3 ${className}`}>
      <div className={`w-6 h-6 rounded-full ${mood.bgColor} shadow-lg animate-pulse`} />
      <div className="text-left">
        <p className="text-sm text-gray-400">Mood Detected</p>
        <p className={`font-semibold ${mood.textColor}`}>{mood.name}</p>
      </div>
    </div>
  );
}