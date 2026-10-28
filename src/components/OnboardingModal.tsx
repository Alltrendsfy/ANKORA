import React, { useState } from 'react';
import {
  SupportedLanguage,
  SUPPORTED_LANGUAGES,
  getTranslation,
} from '../i18n/translations';
import { UserProfile, ResidencyStatus } from '../types/profile';
import { getAvailableCountries } from '../data/ankoraData';
import { AnkoraLogo } from './AnkoraLogo';
import { Check, ShieldAlert, Globe, UserCheck } from 'lucide-react';

interface OnboardingModalProps {
  initialProfile: UserProfile;
  onSave: (profile: UserProfile) => void;
  isEditing?: boolean;
  onClose?: () => void;
}

export const OnboardingModal: React.FC<OnboardingModalProps> = ({
  initialProfile,
  onSave,
  isEditing = false,
  onClose,
}) => {
  const [lang, setLang] = useState<SupportedLanguage>(initialProfile.language);
  const [residency, setResidency] = useState<ResidencyStatus>(initialProfile.residencyStatus);
  const [nationality, setNationality] = useState<string>(initialProfile.nationality);
  const [showConsulate, setShowConsulate] = useState<boolean>(initialProfile.showConsulate);

  const t = getTranslation(lang);
  const countries = getAvailableCountries();

  const handleFinish = () => {
    onSave({
      ...initialProfile,
      language: lang,
      residencyStatus: residency,
      nationality,
      showConsulate,
      onboardingCompleted: true,
    });
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/65 backdrop-blur-xs p-3 overflow-y-auto">
      <div
        className="w-full max-w-[430px] my-auto bg-white dark:bg-[#0A1720] border border-slate-200 dark:border-slate-800 rounded-2xl shadow-2xl p-5 text-[#0F2B3D] dark:text-[#E6EDF2] flex flex-col gap-4 animate-in fade-in duration-200"
        dir={SUPPORTED_LANGUAGES.find((l) => l.code === lang)?.dir || 'ltr'}
      >
        {/* Header */}
        <div className="flex items-center justify-between pb-2 border-b border-slate-100 dark:border-slate-800">
          <div className="flex items-center gap-2">
            <AnkoraLogo size={32} showWordmark={true} />
          </div>
          {isEditing && onClose && (
            <button
              onClick={onClose}
              className="text-xs px-2.5 py-1 rounded-md text-slate-500 hover:text-slate-800 dark:hover:text-slate-200"
            >
              ✕
            </button>
          )}
        </div>

        <div>
          <h2 className="font-sora text-lg text-[#0F2B3D] dark:text-[#E6EDF2]">
            {t.onboardingTitle}
          </h2>
          <p className="text-xs text-[#4A5C6A] dark:text-slate-400 mt-1 leading-relaxed">
            {t.onboardingSubtitle}
          </p>
        </div>

        {/* 1. Language */}
        <div className="space-y-1.5">
          <label className="text-xs font-semibold flex items-center gap-1.5 text-[#0F2B3D] dark:text-slate-200">
            <Globe className="w-3.5 h-3.5 text-[#0E7C74]" />
            {t.chooseLanguage}
          </label>
          <select
            value={lang}
            onChange={(e) => setLang(e.target.value as SupportedLanguage)}
            className="w-full h-12 px-3 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl text-sm font-medium focus:outline-hidden focus:ring-2 focus:ring-[#0E7C74]"
          >
            {SUPPORTED_LANGUAGES.map((l) => (
              <option key={l.code} value={l.code}>
                {l.nativeLabel} {l.code !== 'it' && l.code !== 'pt-BR' && `(${l.label})`}
              </option>
            ))}
          </select>
        </div>

        {/* 2. Residency Status */}
        <div className="space-y-1.5">
          <label className="text-xs font-semibold flex items-center gap-1.5 text-[#0F2B3D] dark:text-slate-200">
            <UserCheck className="w-3.5 h-3.5 text-[#0E7C74]" />
            {t.statusQuestion}
          </label>
          <div className="grid grid-cols-2 gap-2">
            <button
              type="button"
              onClick={() => setResidency('traveling')}
              className={`h-12 px-3 rounded-xl text-xs font-medium border text-left transition-all flex items-center justify-between ${
                residency === 'traveling'
                  ? 'border-[#0F2B3D] dark:border-white bg-[#0F2B3D]/5 dark:bg-white/10 font-semibold'
                  : 'border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-900/60 text-slate-700 dark:text-slate-300'
              }`}
            >
              <span>{t.statusTraveling}</span>
              {residency === 'traveling' && <Check className="w-4 h-4 text-[#0F2B3D] dark:text-white shrink-0" />}
            </button>
            <button
              type="button"
              onClick={() => setResidency('living')}
              className={`h-12 px-3 rounded-xl text-xs font-medium border text-left transition-all flex items-center justify-between ${
                residency === 'living'
                  ? 'border-[#0F2B3D] dark:border-white bg-[#0F2B3D]/5 dark:bg-white/10 font-semibold'
                  : 'border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-900/60 text-slate-700 dark:text-slate-300'
              }`}
            >
              <span>{t.statusLiving}</span>
              {residency === 'living' && <Check className="w-4 h-4 text-[#0F2B3D] dark:text-white shrink-0" />}
            </button>
          </div>
        </div>

        {/* 3. Nationality */}
        <div className="space-y-1.5">
          <label className="text-xs font-semibold text-[#0F2B3D] dark:text-slate-200">
            {t.nationalityQuestion}
          </label>
          <select
            value={nationality}
            onChange={(e) => setNationality(e.target.value)}
            className="w-full h-12 px-3 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl text-sm font-medium focus:outline-hidden focus:ring-2 focus:ring-[#0E7C74]"
          >
            <option value="__prefer_not__">{t.nationalityPreferNot}</option>
            {countries.map((c) => (
              <option key={c.nameIt} value={c.nameIt}>
                {c.nameIt}
              </option>
            ))}
          </select>
        </div>

        {/* 4. Mandatory Safeguard */}
        <div className="p-3.5 rounded-xl border border-amber-200 dark:border-amber-900/40 bg-[#FFF4E5] dark:bg-amber-950/20 space-y-2">
          <div className="flex items-start gap-2">
            <ShieldAlert className="w-4 h-4 text-[#B45309] dark:text-amber-400 shrink-0 mt-0.5" />
            <div>
              <p className="text-xs font-semibold text-[#B45309] dark:text-amber-300 leading-snug">
                {t.safeguardQuestion}
              </p>
              <p className="text-[11px] text-[#B45309]/90 dark:text-amber-400/90 mt-1 leading-normal">
                {t.safeguardHelper}
              </p>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-2 pt-1">
            <button
              type="button"
              onClick={() => setShowConsulate(true)}
              className={`h-11 rounded-lg text-xs font-medium flex items-center justify-center gap-1.5 transition-all ${
                showConsulate
                  ? 'bg-[#0F2B3D] text-white shadow-xs font-semibold'
                  : 'bg-white dark:bg-slate-800 text-slate-800 dark:text-slate-200 border border-amber-200 dark:border-slate-700'
              }`}
            >
              {showConsulate && <Check className="w-3.5 h-3.5 text-white" />}
              {t.yes}
            </button>
            <button
              type="button"
              onClick={() => setShowConsulate(false)}
              className={`h-11 rounded-lg text-xs font-medium flex items-center justify-center gap-1.5 transition-all ${
                !showConsulate
                  ? 'bg-[#0F2B3D] text-white shadow-xs font-semibold'
                  : 'bg-white dark:bg-slate-800 text-slate-800 dark:text-slate-200 border border-amber-200 dark:border-slate-700'
              }`}
            >
              {!showConsulate && <Check className="w-3.5 h-3.5 text-white" />}
              {t.no}
            </button>
          </div>
        </div>

        {/* Action Button */}
        <button
          type="button"
          onClick={handleFinish}
          className="w-full h-12 mt-1 rounded-xl bg-[#0F2B3D] dark:bg-white text-white dark:text-[#0F2B3D] font-sora text-sm font-semibold tracking-wide hover:opacity-95 active:scale-[0.99] transition shadow-md flex items-center justify-center"
        >
          {isEditing ? t.saveBtn : t.continueBtn}
        </button>
      </div>
    </div>
  );
};
