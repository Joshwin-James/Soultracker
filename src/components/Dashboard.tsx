import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';
import { TrendingUp, Heart, Brain, Lightbulb, Loader2 } from 'lucide-react';
import { api } from '../services/api';
import { EmotionalHealthData } from '../types';

const emotionColors = {
  joy: '#F59E0B',
  calm: '#3B82F6',
  anxiety: '#F97316',
  frustration: '#EF4444',
  sadness: '#8B5CF6'
};

export default function Dashboard() {
  const [healthData, setHealthData] = useState<EmotionalHealthData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadHealthData();
  }, []);

  const loadHealthData = async () => {
    try {
      const data = await api.getEmotionalHealth();
      setHealthData(data);
    } catch (error) {
      console.error('Failed to load health data:', error);
    } finally {
      setLoading(false);
    }
  };

  const getScoreColor = (score: number) => {
    if (score >= 80) return 'from-green-400 to-emerald-500';
    if (score >= 60) return 'from-blue-400 to-cyan-500';
    if (score >= 40) return 'from-yellow-400 to-orange-500';
    return 'from-red-400 to-pink-500';
  };

  const getScoreMessage = (score: number) => {
    if (score >= 80) return 'Excellent emotional wellness! 🌟';
    if (score >= 60) return 'Good emotional balance 😊';
    if (score >= 40) return 'Room for improvement 💪';
    return 'Let\'s work together 🤗';
  };

  if (loading) {
    return (
      <div className="max-w-6xl mx-auto p-6 flex items-center justify-center min-h-[60vh]">
        <div className="text-center">
          <Loader2 className="w-12 h-12 animate-spin text-purple-500 mx-auto mb-4" />
          <p className="text-lg text-gray-600">Loading your emotional wellness dashboard...</p>
        </div>
      </div>
    );
  }

  if (!healthData) {
    return (
      <div className="max-w-6xl mx-auto p-6 text-center">
        <p className="text-lg text-gray-600">Unable to load dashboard data. Please try again later.</p>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto p-6 space-y-8">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center"
      >
        <h1 className="text-4xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent mb-4">
          Emotional Health Dashboard
        </h1>
        <p className="text-lg text-gray-600">
          Track your emotional wellness journey and discover insights about your mental health patterns
        </p>
      </motion.div>

      {/* Emotional Health Score */}
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ delay: 0.2 }}
        className="bg-white rounded-3xl shadow-2xl p-8"
      >
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-800 mb-6 flex items-center justify-center gap-2">
            <Heart className="w-6 h-6 text-red-400" />
            Emotional Health Score
          </h2>
          
          <div className="relative w-48 h-48 mx-auto mb-6">
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: 0.5, type: "spring", stiffness: 200 }}
              className={`w-full h-full rounded-full bg-gradient-to-r ${getScoreColor(healthData.score)} flex items-center justify-center shadow-2xl`}
            >
              <div className="w-36 h-36 bg-white rounded-full flex items-center justify-center">
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.8 }}
                  className="text-center"
                >
                  <div className="text-4xl font-bold text-gray-800">{healthData.score}</div>
                  <div className="text-sm text-gray-500">out of 100</div>
                </motion.div>
              </div>
            </motion.div>
            
            <motion.div
              animate={{
                background: [
                  `conic-gradient(from 0deg, ${getScoreColor(healthData.score).includes('green') ? '#10B981' : 
                    getScoreColor(healthData.score).includes('blue') ? '#3B82F6' :
                    getScoreColor(healthData.score).includes('yellow') ? '#F59E0B' : '#EF4444'} 0deg, 
                    ${getScoreColor(healthData.score).includes('green') ? '#059669' : 
                    getScoreColor(healthData.score).includes('blue') ? '#1D4ED8' :
                    getScoreColor(healthData.score).includes('yellow') ? '#D97706' : '#DC2626'} ${healthData.score * 3.6}deg, 
                    transparent ${healthData.score * 3.6}deg)`
                ]
              }}
              transition={{ duration: 2, delay: 0.5 }}
              className="absolute inset-0 rounded-full opacity-20"
            />
          </div>
          
          <motion.p
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 1 }}
            className="text-lg font-medium text-gray-700"
          >
            {getScoreMessage(healthData.score)}
          </motion.p>
        </div>
      </motion.div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Top Emotions */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.3 }}
          className="bg-white rounded-3xl shadow-2xl p-8"
        >
          <h2 className="text-2xl font-bold text-gray-800 mb-6 flex items-center gap-2">
            <Brain className="w-6 h-6 text-purple-500" />
            Your Top Emotions
          </h2>
          
          <div className="space-y-4">
            {healthData.topEmotions.map((emotion, index) => (
              <motion.div
                key={emotion.emotion}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.5 + index * 0.1 }}
                className="flex items-center justify-between p-4 bg-gray-50 rounded-2xl"
              >
                <div className="flex items-center space-x-3">
                  <div
                    className="w-4 h-4 rounded-full"
                    style={{ backgroundColor: emotionColors[emotion.emotion] }}
                  />
                  <span className="font-medium text-gray-800 capitalize">
                    {emotion.emotion}
                  </span>
                </div>
                <div className="text-right">
                  <div className="font-bold text-gray-800">{emotion.count}</div>
                  <div className="text-sm text-gray-500">{emotion.percentage}%</div>
                </div>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* Weekly Trend Chart */}
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.4 }}
          className="bg-white rounded-3xl shadow-2xl p-8"
        >
          <h2 className="text-2xl font-bold text-gray-800 mb-6 flex items-center gap-2">
            <TrendingUp className="w-6 h-6 text-green-500" />
            7-Day Emotion Trend
          </h2>
          
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={healthData.weeklyTrend}>
                <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                <XAxis 
                  dataKey="date" 
                  tick={{ fontSize: 12 }}
                  tickFormatter={(value) => new Date(value).toLocaleDateString([], { month: 'short', day: 'numeric' })}
                />
                <YAxis tick={{ fontSize: 12 }} />
                <Tooltip 
                  labelFormatter={(value) => new Date(value).toLocaleDateString()}
                  contentStyle={{ 
                    backgroundColor: 'white', 
                    border: '1px solid #e5e7eb',
                    borderRadius: '12px',
                    boxShadow: '0 10px 25px rgba(0,0,0,0.1)'
                  }}
                />
                <Bar dataKey="joy" stackId="a" fill={emotionColors.joy} radius={[0, 0, 0, 0]} />
                <Bar dataKey="calm" stackId="a" fill={emotionColors.calm} radius={[0, 0, 0, 0]} />
                <Bar dataKey="anxiety" stackId="a" fill={emotionColors.anxiety} radius={[0, 0, 0, 0]} />
                <Bar dataKey="frustration" stackId="a" fill={emotionColors.frustration} radius={[0, 0, 0, 0]} />
                <Bar dataKey="sadness" stackId="a" fill={emotionColors.sadness} radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </motion.div>
      </div>

      {/* Insights */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.6 }}
        className="bg-gradient-to-r from-purple-50 to-pink-50 rounded-3xl shadow-2xl p-8"
      >
        <h2 className="text-2xl font-bold text-gray-800 mb-6 flex items-center gap-2">
          <Lightbulb className="w-6 h-6 text-yellow-500" />
          Personalized Insights
        </h2>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {healthData.insights.map((insight, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.8 + index * 0.1 }}
              className="bg-white rounded-2xl p-6 shadow-lg"
            >
              <div className="text-3xl mb-3">
                {index === 0 ? '🎯' : index === 1 ? '🧘' : '🌟'}
              </div>
              <p className="text-gray-700 leading-relaxed">{insight}</p>
            </motion.div>
          ))}
        </div>
      </motion.div>
    </div>
  );
}