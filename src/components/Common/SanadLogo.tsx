import React from 'react';

interface SanadLogoProps {
  size?: 'xs' | 'sm' | 'md' | 'lg' | 'xl';
  variant?: 'full' | 'compact' | 'icon';
  theme?: 'light' | 'dark';
  className?: string;
  onClick?: () => void;
}

const logoSizes: Record<NonNullable<SanadLogoProps['size']>, string> = {
  xs: 'h-7 w-7', sm: 'h-9 w-9', md: 'h-11 w-11', lg: 'h-14 w-14', xl: 'h-20 w-20',
};
const textSizes: Record<NonNullable<SanadLogoProps['size']>, string> = {
  xs: 'text-xs', sm: 'text-sm', md: 'text-base', lg: 'text-lg', xl: 'text-2xl',
};

export const SanadLogo: React.FC<SanadLogoProps> = ({
  size = 'md', variant = 'full', theme = 'light', className = '', onClick,
}) => (
  <div onClick={onClick} dir="rtl" className={`inline-flex items-center gap-2.5 select-none ${onClick ? 'cursor-pointer' : ''} ${className}`}>
    <img
      src="/brand/sanad-logo-original.png"
      alt="شعار سند"
      className={`${logoSizes[size]} shrink-0 rounded-xl object-cover shadow-sm`}
    />
    {variant !== 'icon' && (
      <div className="flex flex-col text-right leading-tight">
        <span className={`font-black tracking-tight ${textSizes[size]} ${theme === 'dark' ? 'text-white' : 'text-slate-900'}`}>سند</span>
        {variant === 'full' && <span className={`text-[10px] font-medium ${theme === 'dark' ? 'text-slate-300' : 'text-slate-500'}`}>منصة التجارة ونقاط البيع الذكية</span>}
      </div>
    )}
  </div>
);
