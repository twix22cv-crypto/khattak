import React from 'react';
import { useApp } from '../../context/AppContext';
import { KhattakLogo } from './KhattakLogo';
import {
  Zap,
  Building2,
  Users,
  Calculator,
  Globe,
  RotateCcw,
  Sparkles,
} from 'lucide-react';
import { UserRole } from '../../types';

export const Header: React.FC = () => {
  const {
    role,
    setRole,
    language,
    setLanguage,
    t,
    generator,
    subscribers,
    currentSubscriberId,
    setCurrentSubscriberId,
    resetToDefaultData,
  } = useApp();

  const navItems: { id: UserRole; label: string; icon: React.ReactNode }[] = [
    {
      id: 'owner',
      label: language === 'ar' ? 'لوحة صاحب المولدة' : 'Owner Dashboard',
      icon: <Building2 className="w-4 h-4" />,
    },
    {
      id: 'subscriber',
      label: language === 'ar' ? 'تطبيق المشترك (خطي)' : 'Subscriber App',
      icon: <Zap className="w-4 h-4" />,
    },
    {
      id: 'calculator',
      label: language === 'ar' ? 'حاسبة الكاز والأرباح' : 'Fuel & ROI Calc',
      icon: <Calculator className="w-4 h-4" />,
    },
  ];

  const stateBadges = {
    running: {
      text: language === 'ar' ? 'المولدة شغالة ⚡' : 'Generator Active ⚡',
      bg: 'bg-emerald-500/15 text-emerald-300 border-emerald-500/30',
      dot: 'bg-emerald-400 animate-pulse',
    },
    national_grid: {
      text: language === 'ar' ? 'الكهرباء الوطنية 🏛️' : 'National Grid 🏛️',
      bg: 'bg-blue-500/15 text-blue-300 border-blue-500/30',
      dot: 'bg-blue-400',
    },
    maintenance: {
      text: language === 'ar' ? 'صيانة دورية 🛠️' : 'Maintenance 🛠️',
      bg: 'bg-amber-500/15 text-amber-300 border-amber-500/30',
      dot: 'bg-amber-400 animate-ping',
    },
    stopped: {
      text: language === 'ar' ? 'متوقفة ⚠️' : 'Generator Stopped',
      bg: 'bg-rose-500/15 text-rose-300 border-rose-500/30',
      dot: 'bg-rose-400',
    },
  };

  const currentBadge = stateBadges[generator.state];

  return (
    <header className="sticky top-0 z-40 w-full border-b border-slate-800/60 bg-[#080c18]/90 backdrop-blur-md">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-20 flex items-center justify-between gap-4">
        {/* Zone 1: Brand */}
        <div className="shrink-0">
          <KhattakLogo size="sm" />
        </div>

        {/* Zone 2: Navigation Controls */}
        <nav className="flex items-center gap-1.5 p-1.5 rounded-xl bg-[#040710] border border-slate-800">
          {navItems.map((item) => {
            const isActive = role === item.id;
            return (
              <button
                key={item.id}
                onClick={() => setRole(item.id)}
                className={`flex items-center gap-2 px-4 py-2 rounded-lg text-xs md:text-sm font-medium transition-all whitespace-nowrap shrink-0 ${
                  isActive
                    ? 'bg-amber-500 text-slate-950 font-bold shadow-[0_4px_12px_rgba(245,158,11,0.3)]'
                    : 'text-slate-400 hover:text-white hover:bg-white/5'
                }`}
              >
                {item.icon}
                <span>{item.label}</span>
              </button>
            );
          })}
        </nav>

        {/* Zone 3: Actions & Live State */}
        <div className="flex items-center gap-2.5 shrink-0">
          {/* Real-time Generator Status Indicator */}
          <div
            className={`hidden md:flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-semibold border ${currentBadge.bg}`}
          >
            <span className={`w-2 h-2 rounded-full ${currentBadge.dot}`} />
            <span className="whitespace-nowrap">{currentBadge.text}</span>
          </div>

          {/* Subscriber Persona Switcher (visible when in subscriber mode) */}
          {role === 'subscriber' && (
            <div className="hidden lg:flex items-center gap-1 bg-[#040710] border border-slate-800 rounded-lg px-2.5 py-1.5">
              <Users className="w-3.5 h-3.5 text-slate-400 shrink-0" />
              <select
                value={currentSubscriberId}
                onChange={(e) => setCurrentSubscriberId(e.target.value)}
                className="bg-transparent text-xs text-amber-400 font-medium focus:outline-none cursor-pointer max-w-[140px] truncate"
              >
                {subscribers.map((s) => (
                  <option key={s.id} value={s.id} className="bg-[#080c18] text-white">
                    {s.name} ({s.amperes}A)
                  </option>
                ))}
              </select>
            </div>
          )}

          {/* Language Toggle */}
          <button
            onClick={() => setLanguage(language === 'ar' ? 'en' : 'ar')}
            className="flex items-center gap-1 px-3 py-2 rounded-lg bg-[#040710] border border-slate-800 text-xs font-semibold text-slate-300 hover:text-white hover:border-slate-700 hover:bg-white/5 transition"
            title="تبديل اللغة / Switch Language"
          >
            <Globe className="w-3.5 h-3.5" />
            <span className="uppercase">{language === 'ar' ? 'EN' : 'عربي'}</span>
          </button>

          {/* Reset Demo Data Button */}
          <button
            onClick={() => {
              if (window.confirm(language === 'ar' ? 'هل تريد استعادة البيانات الافتراضية للتطبيق؟' : 'Reset to default Iraqi sample data?')) {
                resetToDefaultData();
              }
            }}
            className="p-2 rounded-lg bg-[#040710] border border-slate-800 text-slate-400 hover:text-amber-400 hover:border-amber-500/40 hover:bg-white/5 transition"
            title={language === 'ar' ? 'استعادة البيانات الافتراضية' : 'Reset sample data'}
          >
            <RotateCcw className="w-4 h-4" />
          </button>
        </div>
      </div>
    </header>
  );
};
