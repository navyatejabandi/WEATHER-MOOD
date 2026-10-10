import React from 'react';

export const LushMeadow: React.FC<{ className?: string }> = ({ className = '' }) => {
  return (
    <div className={`relative w-full overflow-hidden pointer-events-none select-none ${className}`}>
      <svg
        viewBox="0 0 400 120"
        className="w-full h-auto drop-shadow-sm"
        preserveAspectRatio="none"
      >
        {/* Rolling soft green hills */}
        <path
          d="M 0 65 Q 120 40 240 60 Q 340 75 400 50 L 400 120 L 0 120 Z"
          fill="#BBF7D0"
          opacity="0.6"
        />
        <path
          d="M 0 80 Q 90 60 210 75 Q 310 88 400 70 L 400 120 L 0 120 Z"
          fill="#86EFAC"
          opacity="0.75"
        />
        <path
          d="M 0 95 Q 140 82 280 92 L 400 85 L 400 120 L 0 120 Z"
          fill="#4ADE80"
          opacity="0.9"
        />

        {/* Stems and Leaves */}
        <g stroke="#15803D" strokeWidth="2" strokeLinecap="round">
          <path d="M 45 95 Q 48 75 42 60" />
          <path d="M 85 105 Q 88 80 95 65" />
          <path d="M 140 100 Q 138 80 145 70" />
          <path d="M 210 105 Q 212 85 208 72" />
          <path d="M 280 95 Q 284 75 278 62" />
          <path d="M 335 100 Q 330 80 340 68" />
          <path d="M 370 105 Q 375 88 368 75" />
        </g>

        {/* Left Pink Flower */}
        <g transform="translate(42, 58)">
          <circle cx="-6" cy="0" r="6" fill="#F472B6" />
          <circle cx="6" cy="0" r="6" fill="#F472B6" />
          <circle cx="0" cy="-6" r="6" fill="#F472B6" />
          <circle cx="0" cy="6" r="6" fill="#F472B6" />
          <circle cx="0" cy="0" r="4.5" fill="#FDE047" />
        </g>

        {/* Cyan/Blue Flower */}
        <g transform="translate(95, 63)">
          <circle cx="-5" cy="0" r="5.5" fill="#38BDF8" />
          <circle cx="5" cy="0" r="5.5" fill="#38BDF8" />
          <circle cx="0" cy="-5" r="5.5" fill="#38BDF8" />
          <circle cx="0" cy="5" r="5.5" fill="#38BDF8" />
          <circle cx="0" cy="0" r="4" fill="#FEF08A" />
        </g>

        {/* Center Peachy Rose */}
        <g transform="translate(145, 68)">
          <circle cx="-6" cy="-2" r="5.5" fill="#FB7185" />
          <circle cx="6" cy="-2" r="5.5" fill="#FB7185" />
          <circle cx="0" cy="-7" r="5.5" fill="#FB7185" />
          <circle cx="-4" cy="5" r="5.5" fill="#FB7185" />
          <circle cx="4" cy="5" r="5.5" fill="#FB7185" />
          <circle cx="0" cy="0" r="4.5" fill="#FDE047" />
        </g>

        {/* Small Yellow Daisy */}
        <g transform="translate(208, 70)">
          <circle cx="-5" cy="0" r="5" fill="#FCD34D" />
          <circle cx="5" cy="0" r="5" fill="#FCD34D" />
          <circle cx="0" cy="-5" r="5" fill="#FCD34D" />
          <circle cx="0" cy="5" r="5" fill="#FCD34D" />
          <circle cx="0" cy="0" r="3.5" fill="#FB923C" />
        </g>

        {/* Pink Large Blossom */}
        <g transform="translate(278, 60)">
          <circle cx="-7" cy="0" r="7" fill="#F472B6" />
          <circle cx="7" cy="0" r="7" fill="#F472B6" />
          <circle cx="0" cy="-7" r="7" fill="#F472B6" />
          <circle cx="0" cy="7" r="7" fill="#F472B6" />
          <circle cx="0" cy="0" r="5" fill="#FEF08A" />
        </g>

        {/* Sky Blue Flower Right */}
        <g transform="translate(340, 66)">
          <circle cx="-6" cy="0" r="5.5" fill="#67E8F9" />
          <circle cx="6" cy="0" r="5.5" fill="#67E8F9" />
          <circle cx="0" cy="-6" r="5.5" fill="#67E8F9" />
          <circle cx="0" cy="6" r="5.5" fill="#67E8F9" />
          <circle cx="0" cy="0" r="4" fill="#FDE047" />
        </g>

        {/* Right Corner Flower */}
        <g transform="translate(368, 73)">
          <circle cx="-5" cy="0" r="5" fill="#F472B6" />
          <circle cx="5" cy="0" r="5" fill="#F472B6" />
          <circle cx="0" cy="-5" r="5" fill="#F472B6" />
          <circle cx="0" cy="5" r="5" fill="#F472B6" />
          <circle cx="0" cy="0" r="3.5" fill="#FEF08A" />
        </g>
      </svg>
    </div>
  );
};
