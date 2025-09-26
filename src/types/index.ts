export interface User {
  id: string;
  name: string;
  email: string;
  points: number;
  currentStreak: number;
  level: string;
  joinedAt: string;
}

export interface ChatMessage {
  id: string;
  text: string;
  sender: 'user' | 'bot';
  timestamp: string;
  emotion?: EmotionType;
  moodBooster?: MoodBooster;
}

export type EmotionType = 'joy' | 'calm' | 'anxiety' | 'frustration' | 'sadness';

export interface EmotionData {
  emotion: EmotionType;
  confidence: number;
  color: string;
  emoji: string;
  description: string;
}

export interface MoodBooster {
  id: string;
  title: string;
  description: string;
  points: number;
  completed: boolean;
}

export interface EmotionalHealthData {
  score: number;
  topEmotions: Array<{
    emotion: EmotionType;
    count: number;
    percentage: number;
  }>;
  weeklyTrend: Array<{
    date: string;
    joy: number;
    calm: number;
    anxiety: number;
    frustration: number;
    sadness: number;
  }>;
  insights: string[];
}

export interface ApiResponse<T> {
  success: boolean;
  data: T;
  message?: string;
}