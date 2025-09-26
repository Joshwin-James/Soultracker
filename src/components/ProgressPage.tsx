import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Trophy, Star, Flame, Award, TrendingUp, Target, Zap } from 'lucide-react';
import { useAuth } from '../hooks/useAuth';

const levels = [
  { name: 'Emotional Newbie', minPoints: 0, maxPoints: 99, color: 'from-gray-400 to-gray-500', icon: '🌱' },
  { name: 'Mindful Explorer', minPoints: 100, maxPoints: 299, color: 'from-green-400 to-green-500', icon: '🌿' },
  { name: 'Wellness Warrior', minPoints: 300, maxPoints: 599, color: 'from-blue-400 to-blue-500', icon: '⚔️' },
  { name: 'Emotional Expert', minPoints: 600, maxPoints: 999, color: 'from-purple-400 to-purple-500', icon: '🧠' },
  { name: 'Zen Master', minPoints: 1000, maxPoints: 1999, color: 'from-yellow-400 to-orange-500', icon: '🧘‍♀️' },
  { name: 'Emotional Wizard', minPoints: 2000, maxPoints: Infinity, color: 'from-pink-400 to-red-500', icon: '🧙‍♂️' }
];

const achievements = [
  { id: 1, name: 'First Steps', description: 'Complete your first journal entry', icon: '👶', unlocked: true },
  { id: 2, name: 'Week Warrior', description: 'Maintain a 7-day streak', icon: '🔥', unlocked: true },
  { id: 3, name: 'Mood Master', description: 'Complete 10 mood boosters', icon: '🎯', unlocked: false },
  { id: 4, name: 'Consistency King', description: 'Maintain a 30-day streak', icon: '👑', unlocked: false },
  { id: 5, name: 'Emotional Explorer', description: 'Experience all 5 emotion types', icon: '🗺️', unlocked: true },
  { id: 6, name: 'Wellness Warrior', description: 'Reach 500 total points', icon: '⚔️', unlocked: false }
];

export default function ProgressPage() {
  const { user } = useAuth();
  const [showLevelUp, setShowLevelUp] = useState(false);
  const [currentLevel, setCurrentLevel] = useState(levels[0]);
  const [nextLevel, setNextLevel] = useState(levels[1]);
  const [progressPercentage, setProgressPercentage] = useState(0);

  useEffect(() => {
    if (user) {
      const level = levels.find(l => user.points >= l.minPoints && user.points <= l.maxPoints) || levels[0];
      const nextLevelIndex = levels.findIndex(l => l.name === level.name) + 1;
      const next = nextLevelIndex < levels.length ? levels[nextLevelIndex] : level;
      
      setCurrentLevel(level);
      setNextLevel(next);
      
      if (level !== next) {
        const progress = ((user.points - level.minPoints) / (next.minPoints - level.minPoints)) * 100;
        setProgressPercentage(Math.min(progress, 100));
      } else {
        setProgressPercentage(100);
      }
    }
  }, [user]);

  const handleLevelUpAnimation = () => {
    setShowLevelUp(true);
    setTimeout(() => setShowLevelUp(false), 3000);
  };

  if (!user) {
    return (
      <div className="max-w-4xl mx-auto p-6 text-center">
        <p className="text-lg text-gray-600">Please log in to view your progress.</p>
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
          Your Wellness Journey
        </h1>
        <p className="text-lg text-gray-600">
          Track your emotional growth and celebrate your achievements
        </p>
      </motion.div>

      {/* Current Level & Progress */}
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ delay: 0.2 }}
        className="bg-white rounded-3xl shadow-2xl p-8"
      >
        <div className="text-center mb-8">
          <motion.div
            className="text-6xl mb-4"
            animate={{ 
              rotate: [0, 10, -10, 0],
              scale: [1, 1.1, 1]
            }}
            transition={{ duration: 2, repeat: Infinity }}
          >
            {currentLevel.icon}
          </motion.div>
          
          <h2 className="text-3xl font-bold text-gray-800 mb-2">{currentLevel.name}</h2>
          <p className="text-lg text-gray-600">{user.points} total points earned</p>
        </div>

        {/* Progress Bar */}
        <div className="mb-8">
          <div className="flex justify-between items-center mb-2">
            <span className="text-sm font-medium text-gray-600">Progress to {nextLevel.name}</span>
            <span className="text-sm font-medium text-gray-600">{Math.round(progressPercentage)}%</span>
          </div>
          
          <div className="w-full bg-gray-200 rounded-full h-4 overflow-hidden">
            <motion.div
              initial={{ width: 0 }}
              animate={{ width: `${progressPercentage}%` }}
              transition={{ duration: 1.5, delay: 0.5 }}
              className={`h-full bg-gradient-to-r ${currentLevel.color} rounded-full relative`}
            >
              <motion.div
                animate={{ x: ['-100%', '100%'] }}
                transition={{ duration: 2, repeat: Infinity, ease: 'linear' }}
                className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent"
              />
            </motion.div>
          </div>
          
          <div className="flex justify-between mt-2">
            <span className="text-xs text-gray-500">{currentLevel.minPoints} pts</span>
            <span className="text-xs text-gray-500">{nextLevel.minPoints} pts</span>
          </div>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6 }}
            className="bg-gradient-to-r from-orange-50 to-red-50 rounded-2xl p-6 text-center"
          >
            <Flame className="w-8 h-8 text-orange-500 mx-auto mb-3" />
            <div className="text-2xl font-bold text-gray-800">{user.currentStreak}</div>
            <div className="text-sm text-gray-600">Day Streak</div>
          </motion.div>
          
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.7 }}
            className="bg-gradient-to-r from-purple-50 to-pink-50 rounded-2xl p-6 text-center"
          >
            <Star className="w-8 h-8 text-purple-500 mx-auto mb-3" />
            <div className="text-2xl font-bold text-gray-800">{user.points}</div>
            <div className="text-sm text-gray-600">Total Points</div>
          </motion.div>
          
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.8 }}
            className="bg-gradient-to-r from-green-50 to-blue-50 rounded-2xl p-6 text-center"
          >
            <Trophy className="w-8 h-8 text-green-500 mx-auto mb-3" />
            <div className="text-2xl font-bold text-gray-800">{achievements.filter(a => a.unlocked).length}</div>
            <div className="text-sm text-gray-600">Achievements</div>
          </motion.div>
        </div>
      </motion.div>

      {/* Level Progression */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4 }}
        className="bg-white rounded-3xl shadow-2xl p-8"
      >
        <h2 className="text-2xl font-bold text-gray-800 mb-6 flex items-center gap-2">
          <TrendingUp className="w-6 h-6 text-blue-500" />
          Level Progression
        </h2>
        
        <div className="space-y-4">
          {levels.map((level, index) => {
            const isCurrentLevel = level.name === currentLevel.name;
            const isUnlocked = user.points >= level.minPoints;
            
            return (
              <motion.div
                key={level.name}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.6 + index * 0.1 }}
                className={`flex items-center justify-between p-4 rounded-2xl transition-all ${
                  isCurrentLevel 
                    ? 'bg-gradient-to-r from-purple-100 to-pink-100 border-2 border-purple-300' 
                    : isUnlocked 
                      ? 'bg-green-50 border border-green-200' 
                      : 'bg-gray-50 border border-gray-200'
                }`}
              >
                <div className="flex items-center space-x-4">
                  <div className="text-2xl">{level.icon}</div>
                  <div>
                    <div className={`font-semibold ${isCurrentLevel ? 'text-purple-800' : isUnlocked ? 'text-green-800' : 'text-gray-600'}`}>
                      {level.name}
                    </div>
                    <div className="text-sm text-gray-500">
                      {level.maxPoints === Infinity ? `${level.minPoints}+ points` : `${level.minPoints}-${level.maxPoints} points`}
                    </div>
                  </div>
                </div>
                
                <div className="flex items-center space-x-2">
                  {isCurrentLevel && (
                    <motion.div
                      animate={{ scale: [1, 1.2, 1] }}
                      transition={{ duration: 1, repeat: Infinity }}
                      className="bg-purple-500 text-white px-3 py-1 rounded-full text-xs font-medium"
                    >
                      Current
                    </motion.div>
                  )}
                  {isUnlocked && !isCurrentLevel && (
                    <div className="text-green-500">
                      <Award className="w-5 h-5" />
                    </div>
                  )}
                </div>
              </motion.div>
            );
          })}
        </div>
      </motion.div>

      {/* Achievements */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5 }}
        className="bg-white rounded-3xl shadow-2xl p-8"
      >
        <h2 className="text-2xl font-bold text-gray-800 mb-6 flex items-center gap-2">
          <Award className="w-6 h-6 text-yellow-500" />
          Achievements
        </h2>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {achievements.map((achievement, index) => (
            <motion.div
              key={achievement.id}
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.7 + index * 0.1 }}
              className={`p-6 rounded-2xl border-2 transition-all ${
                achievement.unlocked
                  ? 'bg-gradient-to-r from-yellow-50 to-orange-50 border-yellow-300 shadow-lg'
                  : 'bg-gray-50 border-gray-200'
              }`}
            >
              <div className="text-center">
                <motion.div
                  className="text-4xl mb-3"
                  animate={achievement.unlocked ? {
                    rotate: [0, 10, -10, 0],
                    scale: [1, 1.1, 1]
                  } : {}}
                  transition={{ duration: 2, repeat: Infinity }}
                >
                  {achievement.icon}
                </motion.div>
                
                <h3 className={`font-semibold mb-2 ${achievement.unlocked ? 'text-yellow-800' : 'text-gray-600'}`}>
                  {achievement.name}
                </h3>
                
                <p className={`text-sm ${achievement.unlocked ? 'text-yellow-700' : 'text-gray-500'}`}>
                  {achievement.description}
                </p>
                
                {achievement.unlocked && (
                  <motion.div
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    className="mt-3 inline-flex items-center space-x-1 bg-yellow-500 text-white px-3 py-1 rounded-full text-xs font-medium"
                  >
                    <Zap className="w-3 h-3" />
                    <span>Unlocked!</span>
                  </motion.div>
                )}
              </div>
            </motion.div>
          ))}
        </div>
      </motion.div>

      {/* Level Up Animation */}
      <AnimatePresence>
        {showLevelUp && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 flex items-center justify-center z-50"
          >
            <motion.div
              initial={{ scale: 0, rotate: -180 }}
              animate={{ scale: 1, rotate: 0 }}
              exit={{ scale: 0, rotate: 180 }}
              className="bg-white rounded-3xl p-12 text-center shadow-2xl max-w-md"
            >
              <motion.div
                animate={{ 
                  scale: [1, 1.3, 1],
                  rotate: [0, 360, 0]
                }}
                transition={{ duration: 1, repeat: 2 }}
                className="text-8xl mb-6"
              >
                🎉
              </motion.div>
              
              <h3 className="text-3xl font-bold text-gray-800 mb-4">Level Up!</h3>
              <p className="text-lg text-gray-600 mb-2">Congratulations!</p>
              <p className="text-gray-500">You've reached {currentLevel.name}!</p>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}