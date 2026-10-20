import React, { useState, useEffect } from 'react';

interface SplashScreenProps {
  appType: 'admin' | 'merchant' | 'client';
}

const APP_CONFIG = {
  admin: {
    name: 'إدارة السند',
    subtitle: 'Super Admin Dashboard',
    bgGradient: 'from-[#5B21B6] via-[#6D28D9] to-[#7C3AED]',
    accentColor: 'bg-purple-400',
  },
  merchant: {
    name: 'تاجر السند',
    subtitle: 'نقطة البيع والمخزون',
    bgGradient: 'from-[#059669] via-[#10B981] to-[#34D399]',
    accentColor: 'bg-emerald-400',
  },
  client: {
    name: 'سند',
    subtitle: 'SANAD POS & COMMERCE',
    bgGradient: 'from-[#D97706] via-[#F59E0B] to-[#FBBF24]',
    accentColor: 'bg-amber-400',
  },
};

export const SplashScreen: React.FC<SplashScreenProps> = ({ appType }) => {
  const [isVisible, setIsVisible] = useState(true);
  const [fadeOut, setFadeOut] = useState(false);
  const [logoLoaded, setLogoLoaded] = useState(false);
  const config = APP_CONFIG[appType];

  useEffect(() => {
    // إخفاء بعد 2.5 ثانية
    const fadeTimer = setTimeout(() => {
      setFadeOut(true);
    }, 2000);

    const hideTimer = setTimeout(() => {
      setIsVisible(false);
    }, 2600);

    return () => {
      clearTimeout(fadeTimer);
      clearTimeout(hideTimer);
    };
  }, []);

  useEffect(() => {
    // تحميل الأيقونة
    const img = new Image();
    img.src = '/assets/originals/sanad-icon.png';
    img.onload = () => setLogoLoaded(true);
    // Fallback: إظهار حتى لو لم تُحمّل
    setTimeout(() => setLogoLoaded(true), 500);
  }, []);

  if (!isVisible) return null;

  return (
    <div
      className={`fixed inset-0 z-[9999] flex flex-col items-center justify-center bg-gradient-to-br ${config.bgGradient} transition-opacity duration-500 ${
        fadeOut ? 'opacity-0 pointer-events-none' : 'opacity-100'
      }`}
      style={{ willChange: 'opacity' }}
    >
      {/* خلفية متحركة - دوائر */}
      <div className="absolute inset-0 overflow-hidden">
        <div className={`absolute -top-20 -right-20 w-64 h-64 rounded-full ${config.accentColor} opacity-20 animate-pulse-ring`}></div>
        <div className={`absolute -bottom-32 -left-32 w-96 h-96 rounded-full ${config.accentColor} opacity-10 animate-pulse-ring`} style={{ animationDelay: '0.5s' }}></div>
      </div>

      {/* المحتوى الرئيسي */}
      <div className="relative z-10 text-center px-8">
        {/* الشعار - الأيقونة الأصلية */}
        <div className={`mb-6 ${logoLoaded ? 'animate-splash-logo' : 'opacity-0'}`}>
          <div className="relative inline-block">
            {/* هالة خلف الشعار */}
            <div className={`absolute inset-0 ${config.accentColor} rounded-full blur-3xl opacity-40 scale-150`}></div>
            <img
              src="/assets/originals/sanad-icon.png"
              alt="Sanad Logo"
              className="relative w-36 h-36 drop-shadow-2xl"
              style={{ imageRendering: 'auto' }}
            />
          </div>
        </div>

        {/* اسم التطبيق */}
        <div className={`transition-all duration-700 delay-300 ${logoLoaded ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}`}>
          <h1 className="text-5xl font-black text-white mb-2 drop-shadow-lg" style={{ fontFamily: 'Cairo, sans-serif' }}>
            {config.name}
          </h1>
          <p className="text-white/90 text-lg font-medium tracking-wider">
            {config.subtitle}
          </p>
        </div>

        {/* Loader */}
        <div className={`mt-10 transition-all duration-500 delay-700 ${logoLoaded ? 'opacity-100' : 'opacity-0'}`}>
          <div className="w-20 h-1 bg-white/20 rounded-full overflow-hidden mx-auto">
            <div className={`h-full ${config.accentColor} rounded-full animate-shimmer`}></div>
          </div>
          <p className="text-white/60 text-xs mt-3">جاري التحميل...</p>
        </div>
      </div>

      {/* Footer - اسم المنصة */}
      <div className={`absolute bottom-8 text-center transition-all duration-700 delay-1000 ${logoLoaded ? 'opacity-100' : 'opacity-0'}`}>
        <p className="text-white/50 text-xs tracking-widest uppercase">
          Sanad POS & Commerce Platform
        </p>
      </div>
    </div>
  );
};
