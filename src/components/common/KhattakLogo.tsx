import React from 'react';

interface LogoProps {
  size?: 'sm' | 'md' | 'lg' | 'xl';
  showText?: boolean;
  className?: string;
}

export const KhattakLogo: React.FC<LogoProps> = ({
  size = 'md',
  showText = true,
  className = '',
}) => {
  const iconSizes = {
    sm: 'w-8 h-8 text-xl',
    md: 'w-10 h-10 text-2xl',
    lg: 'w-12 h-12 text-3xl',
    xl: 'w-14 h-14 text-4xl',
  };

  const textSizes = {
    sm: 'text-lg',
    md: 'text-xl',
    lg: 'text-2xl',
    xl: 'text-3xl',
  };

  return (
    <div className={`flex items-center gap-3 select-none ${className}`}>
      {/* Icon Emblem: Gradient badge with glow */}
      <div
        className={`${iconSizes[size]} bg-gradient-to-br from-amber-400 to-orange-600 rounded-xl flex items-center justify-center shadow-[0_0_20px_rgba(245,158,11,0.25)] shrink-0`}
      >
        <span className="text-black font-black leading-none pb-0.5">خ</span>
      </div>

      {showText && (
        <div className="flex flex-col">
          <div className="flex items-center gap-1.5">
            <span
              className={`font-bold text-white tracking-tight leading-none ${textSizes[size]}`}
            >
              خَـطَّـك
            </span>
            <span className="text-[10px] uppercase tracking-[0.2em] text-amber-500 font-semibold hidden sm:inline-block">
              Khattak
            </span>
          </div>
          <span className="text-[10px] text-slate-400 font-medium mt-0.5 hidden md:block">
            نظام إدارة المولدات الأهلية
          </span>
        </div>
      )}
    </div>
  );
};

