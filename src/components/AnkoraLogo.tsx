import React from 'react';

interface AnkoraLogoProps {
  className?: string;
  size?: number;
  showWordmark?: boolean;
  wordmarkColor?: string;
}

export const AnkoraLogo: React.FC<AnkoraLogoProps> = ({
  className = '',
  size = 40,
  showWordmark = true,
  wordmarkColor,
}) => {
  return (
    <div className={`inline-flex items-center gap-2.5 ${className}`}>
      <svg
        width={size}
        height={(size * 220) / 200}
        viewBox="0 0 200 220"
        xmlns="http://www.w3.org/2000/svg"
        role="img"
        aria-label="Ankora"
        className="shrink-0"
      >
        {/* Base pin in dark teal #0F2B3D */}
        <path
          d="M100 206 C74 168 38 134 38 86 A62 62 0 0 1 162 86 C162 134 126 168 100 206 Z"
          fill="#0F2B3D"
        />
        {/* Anchor outline in white #FFFFFF */}
        <g
          fill="none"
          stroke="#FFFFFF"
          strokeWidth="9"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <line x1="100" y1="64" x2="100" y2="138" />
          <line x1="80" y1="80" x2="120" y2="80" />
          <path d="M66 108 Q70 140 100 140 Q130 140 134 108" />
          <line x1="58" y1="116" x2="66" y2="104" />
          <line x1="66" y1="104" x2="74" y2="116" />
          <line x1="126" y1="116" x2="134" y2="104" />
          <line x1="134" y1="104" x2="142" y2="116" />
        </g>
        {/* Top emergency ring in #F26A21 */}
        <circle cx="100" cy="52" r="11" fill="none" stroke="#F26A21" strokeWidth="8" />
      </svg>
      {showWordmark && (
        <span
          className={`font-sora text-2xl tracking-tight leading-none lowercase ${
            wordmarkColor || 'text-[#0F2B3D] dark:text-[#E6EDF2]'
          }`}
        >
          ankora
        </span>
      )}
    </div>
  );
};
