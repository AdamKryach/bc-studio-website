import React from 'react';

interface LogoProps {
  className?: string;
  size?: 'sm' | 'md' | 'lg' | 'xl';
  showSubtitle?: boolean;
}

export function Logo({ className = '', size = 'md', showSubtitle = true }: LogoProps) {
  const sizeMap = {
    sm: { icon: 28, text: 'text-base', sub: 'text-[9px]' },
    md: { icon: 36, text: 'text-lg', sub: 'text-[10px]' },
    lg: { icon: 48, text: 'text-2xl', sub: 'text-xs' },
    xl: { icon: 64, text: 'text-3xl', sub: 'text-sm' },
  };

  const currentSize = sizeMap[size];

  return (
    <div className={`flex items-center gap-3 select-none ${className}`}>
      {/* Custom Vector Icon for Black Cloud */}
      <div className="relative flex items-center justify-center shrink-0">
        <svg
          width={currentSize.icon}
          height={currentSize.icon}
          viewBox="0 0 48 48"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          className="filter drop-shadow-[0_0_12px_rgba(0,240,255,0.35)]"
        >
          {/* Outer Cyber Hex/Shield frame */}
          <path
            d="M24 3L42 12V32L24 45L6 32V12L24 3Z"
            fill="#090B10"
            stroke="#1E293B"
            strokeWidth="1.5"
          />
          {/* Inner Accent Ring */}
          <path
            d="M24 6L39 13.5V30.5L24 41.5L9 30.5V13.5L24 6Z"
            stroke="url(#neon-grad)"
            strokeWidth="1.2"
            strokeDasharray="4 2"
            opacity="0.85"
          />
          {/* Stylized Angular Dark Cloud */}
          <path
            d="M17 31C14.7909 31 13 29.2091 13 27C13 25.0452 14.4025 23.418 16.2646 23.0768C16.8927 19.6468 19.878 17 23.5 17C26.7907 17 29.5654 19.1867 30.4357 22.1818C30.9328 22.0628 31.4552 22 32 22C34.7614 22 37 24.2386 37 27C37 29.7614 34.7614 32 32 32H17"
            fill="#121826"
            stroke="#38BDF8"
            strokeWidth="2"
            strokeLinejoin="round"
          />
          {/* Core Circuit Lines */}
          <path d="M24 24V28M20 28H28" stroke="#00F0FF" strokeWidth="1.5" strokeLinecap="round" />
          <circle cx="24" cy="24" r="1.5" fill="#A855F7" />
          <circle cx="20" cy="28" r="1.2" fill="#00F0FF" />
          <circle cx="28" cy="28" r="1.2" fill="#00F0FF" />

          {/* Gradients */}
          <defs>
            <linearGradient id="neon-grad" x1="6" y1="3" x2="42" y2="45" gradientUnits="userSpaceOnUse">
              <stop stopColor="#00F0FF" />
              <stop offset="0.5" stopColor="#818CF8" />
              <stop offset="1" stopColor="#C084FC" />
            </linearGradient>
          </defs>
        </svg>
      </div>

      <div className="flex flex-col">
        <div className="flex items-center gap-1.5 font-extrabold tracking-wider text-white">
          <span className={`${currentSize.text} font-black tracking-widest bg-gradient-to-r from-white via-slate-100 to-slate-300 bg-clip-text text-transparent`}>
            BLACK CLOUD
          </span>
        </div>
        {showSubtitle && (
          <div className="flex items-center gap-2">
            <span className={`${currentSize.sub} uppercase tracking-[0.22em] text-cyan-400 font-mono font-medium`}>
              DEV STUDIO
            </span>
            <span className={`${currentSize.sub} text-slate-500 font-mono`}>•</span>
            <span className={`${currentSize.sub} tracking-widest text-slate-400 font-mono`}>
              EST. 2021
            </span>
          </div>
        )}
      </div>
    </div>
  );
}
