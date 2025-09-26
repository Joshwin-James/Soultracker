import React from 'react';
import { motion } from 'framer-motion';
import { EmotionType } from '../types';

interface EmotiCoachAvatarProps {
  emotion?: EmotionType;
  size?: 'sm' | 'md' | 'lg';
  className?: string;
}

const emotionConfig = {
  joy: { emoji: '😊', color: 'text-yellow-400', bgColor: 'bg-yellow-100' },
  calm: { emoji: '🧘‍♀️', color: 'text-blue-400', bgColor: 'bg-blue-100' },
  anxiety: { emoji: '😰', color: 'text-orange-400', bgColor: 'bg-orange-100' },
  frustration: { emoji: '😤', color: 'text-red-400', bgColor: 'bg-red-100' },
  sadness: { emoji: '😢', color: 'text-purple-400', bgColor: 'bg-purple-100' }
};

const sizeConfig = {
  sm: { container: 'w-12 h-12', emoji: 'text-2xl' },
  md: { container: 'w-16 h-16', emoji: 'text-3xl' },
  lg: { container: 'w-24 h-24', emoji: 'text-5xl' }
};

export default function EmotiCoachAvatar({ emotion, size = 'md', className = '' }: EmotiCoachAvatarProps) {
  const config = emotion ? emotionConfig[emotion] : { emoji: '🤖', color: 'text-indigo-400', bgColor: 'bg-indigo-100' };
  const sizeStyles = sizeConfig[size];

  return (
    <motion.div
      className={`${sizeStyles.container} ${config.bgColor} rounded-full flex items-center justify-center shadow-lg ${className}`}
      animate={{
        scale: [1, 1.05, 1],
        rotate: [0, 2, -2, 0]
      }}
      transition={{
        duration: 2,
        repeat: Infinity,
        ease: "easeInOut"
      }}
    >
      <motion.span
        className={`${sizeStyles.emoji}`}
        animate={emotion === 'anxiety' ? {
          rotate: [0, 5, -5, 0]
        } : emotion === 'frustration' ? {
          scale: [1, 1.1, 1]
        } : {
          y: [0, -2, 0]
        }}
        transition={{
          duration: emotion === 'anxiety' ? 0.5 : emotion === 'frustration' ? 0.3 : 1.5,
          repeat: Infinity,
          ease: "easeInOut"
        }}
      >
        {config.emoji}
      </motion.span>
    </motion.div>
  );
}