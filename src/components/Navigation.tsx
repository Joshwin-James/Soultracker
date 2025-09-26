import React from 'react';
import { motion } from 'framer-motion';
import { MessageCircle, BarChart3, Trophy, User } from 'lucide-react';
import EmotiCoachAvatar from './EmotiCoachAvatar';
import { useAuth } from '../hooks/useAuth';

interface NavigationProps {
  currentPage: string;
  onNavigate: (page: string) => void;
}

const navItems = [
  { id: 'chat', label: 'Chat', icon: MessageCircle },
  { id: 'dashboard', label: 'Dashboard', icon: BarChart3 },
  { id: 'progress', label: 'Progress', icon: Trophy }
];

export default function Navigation({ currentPage, onNavigate }: NavigationProps) {
  const { user } = useAuth();

  return (
    <nav className="bg-white/90 backdrop-blur-md border-b border-purple-100 sticky top-0 z-50">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <div className="flex items-center space-x-3">
            <EmotiCoachAvatar size="sm" />
            <div>
              <h1 className="text-xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
                EmotiCoach
              </h1>
              {user && (
                <p className="text-xs text-gray-500">Welcome back, {user.name}!</p>
              )}
            </div>
          </div>
          
          <div className="flex items-center space-x-1">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = currentPage === item.id;
              
              return (
                <motion.button
                  key={item.id}
                  onClick={() => onNavigate(item.id)}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className={`relative px-4 py-2 rounded-xl font-medium transition-all duration-200 flex items-center space-x-2 ${
                    isActive
                      ? 'bg-gradient-to-r from-purple-500 to-pink-500 text-white shadow-lg'
                      : 'text-gray-600 hover:text-purple-600 hover:bg-purple-50'
                  }`}
                >
                  <Icon className="w-4 h-4" />
                  <span className="hidden sm:inline">{item.label}</span>
                  
                  {isActive && (
                    <motion.div
                      layoutId="activeTab"
                      className="absolute inset-0 bg-gradient-to-r from-purple-500 to-pink-500 rounded-xl -z-10"
                      transition={{ type: "spring", stiffness: 300, damping: 30 }}
                    />
                  )}
                </motion.button>
              );
            })}
            
            {user && (
              <div className="ml-4 flex items-center space-x-2 bg-purple-50 rounded-xl px-3 py-2">
                <div className="text-right">
                  <p className="text-xs text-gray-500">Points</p>
                  <p className="text-sm font-bold text-purple-600">{user.points}</p>
                </div>
                <div className="w-8 h-8 bg-gradient-to-r from-purple-400 to-pink-400 rounded-full flex items-center justify-center">
                  <User className="w-4 h-4 text-white" />
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
}