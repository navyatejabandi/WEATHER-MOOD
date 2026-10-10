import React from 'react';

interface CuteMascotProps {
  size?: 'sm' | 'md' | 'lg';
  className?: string;
}

export const CuteMascot: React.FC<CuteMascotProps> = ({ size = 'md', className = '' }) => {
  const dims = {
    sm: 'w-20 h-16',
    md: 'w-32 h-24',
    lg: 'w-44 h-32',
  }[size];

  return (
    <div className={`relative flex items-center justify-center ${dims} ${className}`}>
      {/* Little sparkle stars */}
      <span className="absolute -top-1 -right-1 text-amber-400 text-xs animate-ping duration-1000">✦</span>
      <span className="absolute top-3 -left-3 text-amber-300 text-xs">✨</span>
      <span className="absolute -bottom-1 -left-1 text-sky-400 text-[10px]">✦</span>

      <svg viewBox="0 0 160 120" className="w-full h-full drop-shadow-md">
        {/* Soft Sun Ray Glow */}
        <circle cx="95" cy="46" r="34" fill="#FEF08A" opacity="0.4" />
        
        {/* Sun Rays */}
        <g stroke="#F59E0B" strokeWidth="3" strokeLinecap="round" opacity="0.8">
          <line x1="95" y1="6" x2="95" y2="14" />
          <line x1="124" y1="18" x2="118" y2="24" />
          <line x1="135" y1="46" x2="127" y2="46" />
          <line x1="124" y1="74" x2="118" y2="68" />
          <line x1="66" y1="18" x2="72" y2="24" />
        </g>

        {/* Sun Body */}
        <circle cx="95" cy="46" r="26" fill="url(#sunGradient)" />
        
        {/* Sun Face */}
        <circle cx="90" cy="43" r="2.5" fill="#78350F" />
        <circle cx="104" cy="43" r="2.5" fill="#78350F" />
        {/* Rosy sun cheeks */}
        <ellipse cx="86" cy="47" rx="3" ry="2" fill="#F43F5E" opacity="0.4" />
        <ellipse cx="108" cy="47" rx="3" ry="2" fill="#F43F5E" opacity="0.4" />
        {/* Sun smile */}
        <path d="M 93 48 Q 97 53 101 48" stroke="#78350F" strokeWidth="2" strokeLinecap="round" fill="none" />

        {/* Fluffy Cloud Body */}
        <path
          d="M 40 85 
             A 18 18 0 0 1 54 58 
             A 22 22 0 0 1 88 54 
             A 20 20 0 0 1 112 72 
             A 16 16 0 0 1 110 88 
             A 12 12 0 0 1 98 96 
             L 42 96 
             A 12 12 0 0 1 40 85 Z"
          fill="url(#cloudGradient)"
          filter="drop-shadow(0 4px 6px rgba(186, 230, 253, 0.5))"
        />

        {/* Cloud Face */}
        <circle cx="68" cy="74" r="2.2" fill="#1E3A8A" />
        <circle cx="82" cy="74" r="2.2" fill="#1E3A8A" />
        {/* Cloud Rosy Cheeks */}
        <ellipse cx="63" cy="77" rx="3.5" ry="2" fill="#FB7185" opacity="0.6" />
        <ellipse cx="87" cy="77" rx="3.5" ry="2" fill="#FB7185" opacity="0.6" />
        {/* Cloud Smile */}
        <path d="M 71 78 Q 75 83 79 78" stroke="#1E3A8A" strokeWidth="2" strokeLinecap="round" fill="none" />

        {/* Gradients */}
        <defs>
          <linearGradient id="sunGradient" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#FDE047" />
            <stop offset="60%" stopColor="#FBBF24" />
            <stop offset="100%" stopColor="#F59E0B" />
          </linearGradient>
          <linearGradient id="cloudGradient" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor="#FFFFFF" />
            <stop offset="70%" stopColor="#F0F9FF" />
            <stop offset="100%" stopColor="#E0F2FE" />
          </linearGradient>
        </defs>
      </svg>
    </div>
  );
};
