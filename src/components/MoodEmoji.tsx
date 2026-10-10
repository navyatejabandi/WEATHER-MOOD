import React from 'react';
import { MoodType } from '../types';

interface MoodEmojiProps {
  mood: MoodType;
  size?: 'sm' | 'md' | 'lg' | 'xl';
  className?: string;
}

export const MoodEmoji: React.FC<MoodEmojiProps> = ({ mood, size = 'md', className = '' }) => {
  const sizeClass = {
    sm: 'w-7 h-7 text-sm',
    md: 'w-12 h-12 text-2xl',
    lg: 'w-16 h-16 text-3xl',
    xl: 'w-20 h-20 text-4xl',
  }[size];

  switch (mood) {
    case 'happy':
      return (
        <div className={`relative rounded-full flex items-center justify-center bg-gradient-to-br from-amber-200 to-amber-400 text-amber-900 shadow-sm ${sizeClass} ${className}`}>
          <svg viewBox="0 0 40 40" className="w-4/5 h-4/5">
            {/* Happy Eyes */}
            <path d="M 11 17 Q 15 12 19 17" stroke="#78350F" strokeWidth="2.5" strokeLinecap="round" fill="none" />
            <path d="M 21 17 Q 25 12 29 17" stroke="#78350F" strokeWidth="2.5" strokeLinecap="round" fill="none" />
            {/* Cheeks */}
            <circle cx="11" cy="22" r="2.5" fill="#F43F5E" opacity="0.4" />
            <circle cx="29" cy="22" r="2.5" fill="#F43F5E" opacity="0.4" />
            {/* Smile */}
            <path d="M 13 22 Q 20 32 27 22" stroke="#78350F" strokeWidth="2.5" strokeLinecap="round" fill="#FEF3C7" />
          </svg>
        </div>
      );
    case 'calm':
      return (
        <div className={`relative rounded-full flex items-center justify-center bg-gradient-to-br from-emerald-200 to-teal-300 text-teal-900 shadow-sm ${sizeClass} ${className}`}>
          <svg viewBox="0 0 40 40" className="w-4/5 h-4/5">
            {/* Calm Serene Closed Eyes */}
            <path d="M 12 18 Q 15 21 18 18" stroke="#064E3B" strokeWidth="2.5" strokeLinecap="round" fill="none" />
            <path d="M 22 18 Q 25 21 28 18" stroke="#064E3B" strokeWidth="2.5" strokeLinecap="round" fill="none" />
            {/* Gentle smile */}
            <path d="M 16 25 Q 20 28 24 25" stroke="#064E3B" strokeWidth="2.2" strokeLinecap="round" fill="none" />
          </svg>
        </div>
      );
    case 'okay':
      return (
        <div className={`relative rounded-full flex items-center justify-center bg-gradient-to-br from-orange-200 to-amber-300 text-amber-900 shadow-sm ${sizeClass} ${className}`}>
          <svg viewBox="0 0 40 40" className="w-4/5 h-4/5">
            {/* Round Eyes */}
            <circle cx="14" cy="18" r="2.5" fill="#78350F" />
            <circle cx="26" cy="18" r="2.5" fill="#78350F" />
            {/* Neutral Mouth */}
            <line x1="14" y1="26" x2="26" y2="26" stroke="#78350F" strokeWidth="2.5" strokeLinecap="round" />
          </svg>
        </div>
      );
    case 'sad':
      return (
        <div className={`relative rounded-full flex items-center justify-center bg-gradient-to-br from-sky-200 to-blue-300 text-blue-900 shadow-sm ${sizeClass} ${className}`}>
          <svg viewBox="0 0 40 40" className="w-4/5 h-4/5">
            {/* Sad Eyebrows */}
            <path d="M 12 14 Q 15 16 18 17" stroke="#1E3A8A" strokeWidth="1.8" strokeLinecap="round" fill="none" />
            <path d="M 28 14 Q 25 16 22 17" stroke="#1E3A8A" strokeWidth="1.8" strokeLinecap="round" fill="none" />
            {/* Eyes */}
            <circle cx="15" cy="19" r="2.2" fill="#1E3A8A" />
            <circle cx="25" cy="19" r="2.2" fill="#1E3A8A" />
            {/* Teardrop */}
            <path d="M 28 20 C 28 22 26.5 24 26.5 24 C 26.5 24 25 22 25 20 C 25 19 26.5 17 26.5 17 C 26.5 17 28 19 28 20 Z" fill="#38BDF8" />
            {/* Downturned mouth */}
            <path d="M 14 27 Q 20 22 26 27" stroke="#1E3A8A" strokeWidth="2.5" strokeLinecap="round" fill="none" />
          </svg>
        </div>
      );
    case 'irritated':
      return (
        <div className={`relative rounded-full flex items-center justify-center bg-gradient-to-br from-rose-200 to-red-400 text-red-900 shadow-sm ${sizeClass} ${className}`}>
          <svg viewBox="0 0 40 40" className="w-4/5 h-4/5">
            {/* Angry Eyebrows */}
            <line x1="12" y1="14" x2="18" y2="17" stroke="#881337" strokeWidth="2.5" strokeLinecap="round" />
            <line x1="28" y1="14" x2="22" y2="17" stroke="#881337" strokeWidth="2.5" strokeLinecap="round" />
            {/* Irritated Eyes */}
            <circle cx="15" cy="20" r="2.2" fill="#881337" />
            <circle cx="25" cy="20" r="2.2" fill="#881337" />
            {/* Wavy irritated grimace */}
            <path d="M 14 27 Q 17 29 20 26 Q 23 29 26 27" stroke="#881337" strokeWidth="2.5" strokeLinecap="round" fill="none" />
          </svg>
        </div>
      );
    default:
      return null;
  }
};
