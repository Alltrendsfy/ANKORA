import React from 'react';
import { TranslationDictionary } from '../i18n/translations';
import { X, Volume2, PhoneCall } from 'lucide-react';

interface HelpCardProps {
  destinationName: string;
  destinationAddress: string;
  t: TranslationDictionary;
  onClose: () => void;
  dir?: 'ltr' | 'rtl';
}

export const HelpCard: React.FC<HelpCardProps> = ({
  destinationName,
  destinationAddress,
  t,
  onClose,
  dir = 'ltr',
}) => {
  // Speech synthesis for Italian phrases if user wants to play it out loud
  const speakItalian = (text: string) => {
    if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
      window.speechSynthesis.cancel();
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.lang = 'it-IT';
      utterance.rate = 0.9;
      window.speechSynthesis.speak(utterance);
    }
  };

  return (
    <div
      className="fixed inset-0 z-50 bg-white text-[#0F2B3D] flex flex-col p-4 sm:p-6 overflow-y-auto select-none"
      dir="ltr" // The card is meant to be shown in Italy to locals (Italian is LTR)
    >
      {/* Top action bar */}
      <div className="flex items-center justify-between pb-3 border-b border-slate-200 shrink-0">
        <div className="flex items-center gap-2">
          <span className="bg-[#0E7C74]/10 text-[#0E7C74] font-sora text-xs uppercase px-2 py-0.5 rounded-md font-semibold tracking-wider">
            {t.showToDriver}
          </span>
        </div>
        <button
          onClick={onClose}
          aria-label={t.closeHelpCard}
          className="h-10 w-10 flex items-center justify-center rounded-full bg-slate-100 hover:bg-slate-200 text-[#0F2B3D] transition active:scale-95"
        >
          <X className="w-5 h-5" />
        </button>
      </div>

      <div className="flex-1 flex flex-col justify-between py-4 space-y-5">
        {/* Destination Box - Large & high contrast */}
        <div className="bg-slate-50 border-2 border-[#0F2B3D] rounded-2xl p-4 sm:p-5 shadow-xs">
          <p className="text-xs uppercase tracking-wider font-bold text-[#0E7C74]">
            Destinazione / Destination
          </p>
          <h1 className="font-sora text-xl sm:text-2xl text-[#0F2B3D] mt-1 font-bold leading-tight">
            {destinationName}
          </h1>
          <div className="mt-3 pt-3 border-t border-slate-200">
            <p className="text-xs text-slate-500 font-semibold uppercase">Indirizzo:</p>
            <p className="text-lg sm:text-xl font-bold text-[#0F2B3D] leading-snug mt-0.5">
              {destinationAddress || 'Modena, Italia'}
            </p>
          </div>
        </div>

        {/* Phrases in Italian with User Translation */}
        <div className="space-y-3">
          {/* Phrase 1 */}
          <div className="p-3.5 rounded-xl border border-slate-200 bg-white shadow-xs flex items-start justify-between gap-3">
            <div>
              <p className="text-lg sm:text-xl font-bold text-[#0F2B3D] leading-snug">
                {t.phrases.help.it}
              </p>
              <p
                className="text-xs text-[#4A5C6A] mt-0.5"
                dir={dir}
              >
                {t.phrases.help.tr}
              </p>
            </div>
            <button
              onClick={() => speakItalian(t.phrases.help.it)}
              title="Ascolta"
              className="p-2 rounded-lg text-slate-400 hover:text-[#0F2B3D] hover:bg-slate-100 transition shrink-0"
            >
              <Volume2 className="w-5 h-5" />
            </button>
          </div>

          {/* Phrase 2 */}
          <div className="p-3.5 rounded-xl border border-slate-200 bg-white shadow-xs flex items-start justify-between gap-3">
            <div>
              <p className="text-lg sm:text-xl font-bold text-[#0F2B3D] leading-snug">
                {t.phrases.noItalian.it}
              </p>
              <p
                className="text-xs text-[#4A5C6A] mt-0.5"
                dir={dir}
              >
                {t.phrases.noItalian.tr}
              </p>
            </div>
            <button
              onClick={() => speakItalian(t.phrases.noItalian.it)}
              title="Ascolta"
              className="p-2 rounded-lg text-slate-400 hover:text-[#0F2B3D] hover:bg-slate-100 transition shrink-0"
            >
              <Volume2 className="w-5 h-5" />
            </button>
          </div>

          {/* Phrase 3 - Take me there */}
          <div className="p-3.5 rounded-xl border-2 border-[#0E7C74] bg-[#0E7C74]/5 shadow-xs flex items-start justify-between gap-3">
            <div>
              <p className="text-lg sm:text-xl font-bold text-[#0F2B3D] leading-snug">
                {t.phrases.takeMe.it}
              </p>
              <p
                className="text-xs text-[#0E7C74] font-medium mt-0.5"
                dir={dir}
              >
                {t.phrases.takeMe.tr}
              </p>
            </div>
            <button
              onClick={() => speakItalian(t.phrases.takeMe.it)}
              title="Ascolta"
              className="p-2 rounded-lg text-[#0E7C74] hover:bg-[#0E7C74]/10 transition shrink-0"
            >
              <Volume2 className="w-5 h-5" />
            </button>
          </div>

          {/* Phrase 4 - Call 112 */}
          <div className="p-3.5 rounded-xl border border-slate-200 bg-white shadow-xs flex items-start justify-between gap-3">
            <div>
              <p className="text-lg sm:text-xl font-bold text-[#0F2B3D] leading-snug">
                {t.phrases.call112.it}
              </p>
              <p
                className="text-xs text-[#4A5C6A] mt-0.5"
                dir={dir}
              >
                {t.phrases.call112.tr}
              </p>
            </div>
            <a
              href="tel:112"
              className="p-2 rounded-lg text-[#B8470B] hover:bg-orange-50 transition shrink-0"
            >
              <PhoneCall className="w-5 h-5" />
            </a>
          </div>
        </div>

        {/* Footer with mandatory validation notice */}
        <div className="pt-2 text-center">
          <p className="text-[11px] text-slate-400 font-medium">
            {t.helpCardValidationNotice}
          </p>
        </div>
      </div>
    </div>
  );
};
