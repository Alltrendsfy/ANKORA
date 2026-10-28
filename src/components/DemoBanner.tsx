import React from 'react';
import { TranslationDictionary } from '../i18n/translations';

interface DemoBannerProps {
  t: TranslationDictionary;
}

export const DemoBanner: React.FC<DemoBannerProps> = ({ t }) => {
  return (
    <aside
      aria-label="Aviso de demonstração"
      className="w-full bg-[#0F2B3D] dark:bg-[#060D12] text-[#E6EDF2] py-1.5 px-3 text-center text-[11px] font-medium tracking-wide shrink-0 border-b border-[#0F2B3D]/20 select-none"
    >
      <span className="opacity-90">{t.demoBanner}</span>
    </aside>
  );
};
