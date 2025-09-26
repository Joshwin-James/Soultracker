import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Send, Loader2, CheckCircle, Flame } from 'lucide-react';
import EmotiCoachAvatar from './EmotiCoachAvatar';
import { api } from '../services/api';
import { ChatMessage, EmotionType, MoodBooster } from '../types';
import { useAuth } from '../hooks/useAuth';

export default function ChatPage() {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [inputText, setInputText] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [currentEmotion, setCurrentEmotion] = useState<EmotionType | undefined>();
  const [activeMoodBooster, setActiveMoodBooster] = useState<MoodBooster | null>(null);
  const [showStreakAnimation, setShowStreakAnimation] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const { user, updateUser } = useAuth();

  useEffect(() => {
    loadChatHistory();
  }, []);

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const loadChatHistory = async () => {
    try {
      const history = await api.getChatHistory();
      setMessages(history);
    } catch (error) {
      console.error('Failed to load chat history:', error);
    }
  };

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const detectEmotionFromInput = (text: string): EmotionType => {
    const lowerText = text.toLowerCase();
    
    if (lowerText.match(/\b(happy|joy|excited|great|amazing|wonderful|fantastic|love|awesome)\b/)) {
      return 'joy';
    }
    if (lowerText.match(/\b(calm|peaceful|relaxed|serene|tranquil|zen|meditation|mindful)\b/)) {
      return 'calm';
    }
    if (lowerText.match(/\b(anxious|worried|nervous|stress|panic|overwhelmed|scared|fear)\b/)) {
      return 'anxiety';
    }
    if (lowerText.match(/\b(frustrated|angry|annoyed|irritated|mad|upset|furious)\b/)) {
      return 'frustration';
    }
    if (lowerText.match(/\b(sad|depressed|down|blue|lonely|empty|hopeless|disappointed)\b/)) {
      return 'sadness';
    }
    
    return 'calm';
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const text = e.target.value;
    setInputText(text);
    
    if (text.trim()) {
      const emotion = detectEmotionFromInput(text);
      setCurrentEmotion(emotion);
    } else {
      setCurrentEmotion(undefined);
    }
  };

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!inputText.trim() || isLoading) return;

    const userMessage: ChatMessage = {
      id: Date.now().toString(),
      text: inputText,
      sender: 'user',
      timestamp: new Date().toISOString(),
      emotion: currentEmotion
    };

    setMessages(prev => [...prev, userMessage]);
    setInputText('');
    setCurrentEmotion(undefined);
    setIsLoading(true);

    try {
      const response = await api.sendMessage(inputText);
      setMessages(prev => [...prev, response.message]);
      
      if (response.moodBooster) {
        setActiveMoodBooster(response.moodBooster);
      }
    } catch (error) {
      console.error('Failed to send message:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleCompleteMoodBooster = async (boosterId: string) => {
    try {
      const result = await api.completeMoodBooster(boosterId);
      
      if (user) {
        await updateUser({ points: result.newTotal });
      }
      
      setActiveMoodBooster(prev => prev ? { ...prev, completed: true } : null);
      
      // Show success message
      const successMessage: ChatMessage = {
        id: Date.now().toString(),
        text: `🎉 Great job! You've earned ${result.points} points for completing that mood booster. Keep up the amazing work!`,
        sender: 'bot',
        timestamp: new Date().toISOString()
      };
      
      setMessages(prev => [...prev, successMessage]);
    } catch (error) {
      console.error('Failed to complete mood booster:', error);
    }
  };

  const handleDailyCheckin = async () => {
    try {
      const result = await api.dailyCheckin();
      
      if (user) {
        await updateUser({ 
          points: result.newTotal, 
          currentStreak: result.streak 
        });
      }
      
      setShowStreakAnimation(true);
      setTimeout(() => setShowStreakAnimation(false), 3000);
      
      const checkinMessage: ChatMessage = {
        id: Date.now().toString(),
        text: `🔥 Daily check-in complete! You've earned ${result.points} points and your streak is now ${result.streak} days! Keep the momentum going!`,
        sender: 'bot',
        timestamp: new Date().toISOString()
      };
      
      setMessages(prev => [...prev, checkinMessage]);
    } catch (error) {
      console.error('Failed to complete daily check-in:', error);
    }
  };

  return (
    <div className="max-w-4xl mx-auto h-[calc(100vh-4rem)] flex flex-col">
      {/* Header with Daily Check-in */}
      <div className="bg-gradient-to-r from-purple-50 to-pink-50 p-4 border-b border-purple-100">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <EmotiCoachAvatar emotion={currentEmotion} />
            <div>
              <h2 className="text-lg font-semibold text-gray-800">Chat with EmotiCoach</h2>
              <p className="text-sm text-gray-600">Your emotional wellness companion</p>
            </div>
          </div>
          
          <div className="flex items-center space-x-4">
            {user && (
              <div className="flex items-center space-x-2 bg-white rounded-xl px-4 py-2 shadow-sm">
                <Flame className="w-5 h-5 text-orange-400" />
                <div className="text-center">
                  <p className="text-lg font-bold text-gray-800">{user.currentStreak}</p>
                  <p className="text-xs text-gray-500">day streak</p>
                </div>
              </div>
            )}
            
            <motion.button
              onClick={handleDailyCheckin}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="bg-gradient-to-r from-green-400 to-blue-500 text-white px-4 py-2 rounded-xl font-medium shadow-lg hover:shadow-xl transition-shadow"
            >
              Daily Check-in (+5 pts)
            </motion.button>
          </div>
        </div>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        <AnimatePresence>
          {messages.map((message) => (
            <motion.div
              key={message.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className={`flex ${message.sender === 'user' ? 'justify-end' : 'justify-start'}`}
            >
              <div className={`max-w-xs lg:max-w-md px-4 py-3 rounded-2xl ${
                message.sender === 'user'
                  ? 'bg-gradient-to-r from-purple-500 to-pink-500 text-white'
                  : 'bg-white shadow-md text-gray-800 border border-gray-100'
              }`}>
                <p className="text-sm leading-relaxed">{message.text}</p>
                <p className={`text-xs mt-2 ${
                  message.sender === 'user' ? 'text-purple-100' : 'text-gray-400'
                }`}>
                  {new Date(message.timestamp).toLocaleTimeString([], { 
                    hour: '2-digit', 
                    minute: '2-digit' 
                  })}
                </p>
              </div>
            </motion.div>
          ))}
        </AnimatePresence>

        {/* Mood Booster Card */}
        <AnimatePresence>
          {activeMoodBooster && (
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              className="bg-gradient-to-r from-blue-50 to-indigo-50 border border-blue-200 rounded-2xl p-6 shadow-lg"
            >
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <h3 className="font-semibold text-gray-800 mb-2 flex items-center">
                    ✨ Mood Booster Suggestion
                  </h3>
                  <h4 className="font-medium text-blue-800 mb-2">{activeMoodBooster.title}</h4>
                  <p className="text-sm text-gray-600 mb-4">{activeMoodBooster.description}</p>
                  
                  {!activeMoodBooster.completed ? (
                    <motion.button
                      onClick={() => handleCompleteMoodBooster(activeMoodBooster.id)}
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      className="bg-gradient-to-r from-green-400 to-blue-500 text-white px-4 py-2 rounded-xl font-medium shadow-md hover:shadow-lg transition-shadow flex items-center space-x-2"
                    >
                      <CheckCircle className="w-4 h-4" />
                      <span>Complete (+{activeMoodBooster.points} pts)</span>
                    </motion.button>
                  ) : (
                    <div className="flex items-center space-x-2 text-green-600">
                      <CheckCircle className="w-5 h-5" />
                      <span className="font-medium">Completed! Great job! 🎉</span>
                    </div>
                  )}
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {isLoading && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="flex justify-start"
          >
            <div className="bg-white shadow-md rounded-2xl px-4 py-3 border border-gray-100">
              <div className="flex items-center space-x-2">
                <Loader2 className="w-4 h-4 animate-spin text-purple-500" />
                <span className="text-sm text-gray-600">EmotiCoach is thinking...</span>
              </div>
            </div>
          </motion.div>
        )}

        <div ref={messagesEndRef} />
      </div>

      {/* Input Form */}
      <form onSubmit={handleSendMessage} className="p-4 bg-white border-t border-gray-100">
        <div className="flex items-end space-x-3">
          <div className="flex-1 relative">
            <textarea
              value={inputText}
              onChange={handleInputChange}
              placeholder="Share how you're feeling today..."
              className="w-full px-4 py-3 border border-gray-200 rounded-2xl resize-none focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all"
              rows={2}
              disabled={isLoading}
            />
            {currentEmotion && (
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                className="absolute right-3 top-3"
              >
                <EmotiCoachAvatar emotion={currentEmotion} size="sm" />
              </motion.div>
            )}
          </div>
          
          <motion.button
            type="submit"
            disabled={!inputText.trim() || isLoading}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="bg-gradient-to-r from-purple-500 to-pink-500 text-white p-3 rounded-2xl shadow-lg hover:shadow-xl transition-shadow disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <Send className="w-5 h-5" />
          </motion.button>
        </div>
      </form>

      {/* Streak Animation Overlay */}
      <AnimatePresence>
        {showStreakAnimation && (
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
              className="bg-white rounded-3xl p-8 text-center shadow-2xl"
            >
              <motion.div
                animate={{ 
                  scale: [1, 1.2, 1],
                  rotate: [0, 10, -10, 0]
                }}
                transition={{ duration: 0.6, repeat: 2 }}
              >
                <Flame className="w-16 h-16 text-orange-400 mx-auto mb-4" />
              </motion.div>
              <h3 className="text-2xl font-bold text-gray-800 mb-2">Streak Updated!</h3>
              <p className="text-gray-600">Keep up the amazing consistency! 🎉</p>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}