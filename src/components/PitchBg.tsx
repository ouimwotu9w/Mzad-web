import React from 'react';

export const PitchBg: React.FC<{ children?: React.ReactNode; className?: string }> = ({ children, className = '' }) => {
  return (
    <div className={`relative min-h-screen w-full bg-[#050B12] overflow-hidden ${className}`}>
      {/* Stadium Floodlights & Ambient Glows */}
      <div className="absolute top-0 left-1/4 -translate-y-1/2 w-[550px] h-[550px] bg-[#35B8FF]/10 rounded-full blur-[130px] pointer-events-none" />
      <div className="absolute top-1/3 right-10 w-[450px] h-[450px] bg-[#FFC94A]/10 rounded-full blur-[140px] pointer-events-none" />
      <div className="absolute bottom-10 left-1/3 w-[500px] h-[500px] bg-[#27D17F]/10 rounded-full blur-[150px] pointer-events-none" />

      {/* Subtle Tactical Pitch Lines */}
      <div className="absolute inset-0 opacity-15 pointer-events-none">
        <svg width="100%" height="100%" xmlns="http://www.w3.org/2000/svg">
          <defs>
            <pattern id="stadium-stripes" width="120" height="120" patternUnits="userSpaceOnUse">
              <rect width="120" height="60" fill="transparent" />
              <rect y="60" width="120" height="60" fill="rgba(255, 255, 255, 0.02)" />
            </pattern>
          </defs>
          <rect width="100%" height="100%" fill="url(#stadium-stripes)" />
          {/* Outer Touchline */}
          <rect x="5%" y="6%" width="90%" height="88%" fill="none" stroke="rgba(255, 255, 255, 0.08)" strokeWidth="2" rx="16" />
          {/* Halfway Line */}
          <line x1="50%" y1="6%" x2="50%" y2="94%" stroke="rgba(255, 255, 255, 0.08)" strokeWidth="2" />
          {/* Center Circle */}
          <circle cx="50%" cy="50%" r="70" fill="none" stroke="rgba(255, 255, 255, 0.08)" strokeWidth="2" />
          <circle cx="50%" cy="50%" r="4" fill="rgba(255, 255, 255, 0.15)" />
        </svg>
      </div>

      <div className="relative z-10 w-full h-full flex flex-col">
        {children}
      </div>
    </div>
  );
};
