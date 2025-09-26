import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import AuthProvider from './components/AuthProvider';
import WelcomePage from './components/WelcomePage';
import Navigation from './components/Navigation';
import ChatPage from './components/ChatPage';
import Dashboard from './components/Dashboard';
import ProgressPage from './components/ProgressPage';
import { useAuth } from './hooks/useAuth';

function AppContent() {
  const [showWelcome, setShowWelcome] = useState(true);
  const [currentPage, setCurrentPage] = useState('chat');
  const { user, loading } = useAuth();

  const handleGetStarted = () => {
    setShowWelcome(false);
  };

  const handleNavigate = (page: string) => {
    setCurrentPage(page);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-50 via-pink-50 to-indigo-50 flex items-center justify-center">
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
          className="w-12 h-12 border-4 border-purple-500 border-t-transparent rounded-full"
        />
      </div>
    );
  }

  if (showWelcome || !user) {
    return <WelcomePage onGetStarted={handleGetStarted} />;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-pink-50 to-indigo-50">
      <Navigation currentPage={currentPage} onNavigate={handleNavigate} />
      
      <AnimatePresence mode="wait">
        <motion.main
          key={currentPage}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -20 }}
          transition={{ duration: 0.3 }}
          className="pb-8"
        >
          {currentPage === 'chat' && <ChatPage />}
          {currentPage === 'dashboard' && <Dashboard />}
          {currentPage === 'progress' && <ProgressPage />}
        </motion.main>
      </AnimatePresence>
    </div>
  );
}

function App() {
  return (
    <AuthProvider>
      <AppContent />
    </AuthProvider>
  );
}

export default App;