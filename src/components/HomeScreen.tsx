import React from 'react';
import { TranslationDictionary, SupportedLanguage } from '../i18n/translations';
import { UserProfile, Coordinates } from '../types/profile';
import { AnkoraLogo } from './AnkoraLogo';
import {
  MapPin,
  Settings,
  PhoneCall,
  AlertTriangle,
  ArrowRight,
  ShieldCheck,
  WifiOff,
} from 'lucide-react';

interface HomeScreenProps {
  profile: UserProfile;
  userCoords: Coordinates;
  gpsActive: boolean;
  isOnline: boolean;
  t: TranslationDictionary;
  lang: SupportedLanguage;
  dir: 'ltr' | 'rtl';
  onNeedHelp: () => void;
  onOpenSettings: () => void;
}

export const HomeScreen: React.FC<HomeScreenProps> = ({
  profile,
  userCoords,
  gpsActive,
  isOnline,
  t,
  lang,
  dir,
  onNeedHelp,
  onOpenSettings,
}) => {
  return (
    <div
      className="flex-1 flex flex-col justify-between p-4 sm:p-5 select-none"
      dir={dir}
    >
      {/* Top Header Bar */}
      <header className="flex items-center justify-between pt-1 pb-3 shrink-0">
        <div className="flex items-center gap-2">
          <AnkoraLogo size={36} showWordmark={true} />
        </div>

        <div className="flex items-center gap-2">
          {/* City / Location status badge */}
          <button
            onClick={onOpenSettings}
            className="h-9 px-2.5 rounded-full bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-[#0F2B3D] dark:text-slate-200 text-xs font-semibold flex items-center gap-1.5 shadow-2xs hover:bg-slate-50 transition"
          >
            <MapPin className="w-3.5 h-3.5 text-[#0E7C74]" />
            <span className="max-w-[120px] truncate">
              {userCoords.name ? userCoords.name.split(',')[0] : 'Modena, Itália'}
            </span>
          </button>

          {/* Settings button */}
          <button
            onClick={onOpenSettings}
            aria-label={t.profileSettings}
            className="h-9 w-9 rounded-full bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-[#0F2B3D] dark:text-slate-200 flex items-center justify-center shadow-2xs hover:bg-slate-50 transition active:scale-95"
          >
            <Settings className="w-4 h-4 text-[#4A5C6A] dark:text-slate-300" />
          </button>
        </div>
      </header>

      {/* Hero / Value Proposition in Emergency */}
      <div className="my-auto py-6 flex flex-col items-center text-center space-y-5">
        {/* Offline indicator if disconnected */}
        {!isOnline && (
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-slate-200/90 dark:bg-slate-800 text-slate-700 dark:text-slate-300 text-xs font-medium">
            <WifiOff className="w-3.5 h-3.5 text-slate-500" />
            <span>Modo offline ativo (dados em cache)</span>
          </div>
        )}

        <div className="space-y-2 max-w-[320px]">
          <h1 className="font-sora text-2xl sm:text-3xl text-[#0F2B3D] dark:text-[#E6EDF2] font-semibold tracking-tight leading-tight">
            Destinos Oficiais em Emergência
          </h1>
          <p className="text-xs text-[#4A5C6A] dark:text-slate-400 leading-relaxed">
            Áreas de espera da Proteção Civil, consulados e frases de socorro em italiano — mesmo sem conexão.
          </p>
        </div>

        {/* Big Emergency Button (Min 64px height, exact #F26A21 background, #0F2B3D text, WCAG contrast compliant) */}
        <div className="w-full max-w-[340px] pt-2">
          <button
            onClick={onNeedHelp}
            className="w-full min-h-[68px] py-4 px-6 rounded-2xl bg-[#F26A21] hover:bg-[#F26A21]/90 active:scale-[0.98] transition-all shadow-lg shadow-[#F26A21]/25 flex items-center justify-between text-[#0F2B3D] font-sora font-semibold text-xl group cursor-pointer border-2 border-[#0F2B3D]/10"
          >
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-[#0F2B3D]/10 flex items-center justify-center shrink-0">
                <AlertTriangle className="w-6 h-6 text-[#0F2B3D]" />
              </div>
              <span className="tracking-tight text-left">{t.needHelp}</span>
            </div>
            <ArrowRight className="w-6 h-6 text-[#0F2B3D] rtl-flip group-hover:translate-x-1 transition-transform" />
          </button>
        </div>

        {/* Secondary Button: Always visible Call 112 (link tel:112) */}
        <div className="w-full max-w-[340px]">
          <a
            href="tel:112"
            className="w-full h-14 rounded-2xl bg-white dark:bg-[#0E1E28] border-2 border-[#0F2B3D] dark:border-slate-700 text-[#0F2B3D] dark:text-[#E6EDF2] font-sora text-base font-semibold flex items-center justify-center gap-2.5 shadow-xs hover:bg-slate-50 dark:hover:bg-slate-800 transition active:scale-[0.99]"
          >
            <PhoneCall className="w-5 h-5 text-[#B8470B] dark:text-[#FF8A47]" />
            <span>{t.call112}</span>
            <span className="text-xs text-slate-500 font-normal opacity-85">
              (emergência)
            </span>
          </a>
        </div>
      </div>

      {/* Discrete footer status line (PRD requirement 2) */}
      <footer className="pt-4 pb-2 text-center shrink-0">
        <p className="text-[11px] text-[#4A5C6A] dark:text-slate-400 font-medium">
          {t.verifiedDataNote}
        </p>
      </footer>
    </div>
  );
};
