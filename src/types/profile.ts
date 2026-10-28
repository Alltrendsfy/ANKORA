import { SupportedLanguage } from '../i18n/translations';

export type ResidencyStatus = 'traveling' | 'living';

export type LocationSimulationMode = 'real' | 'piazza_grande' | 'train_station' | 'rome_center';

export interface UserProfile {
  language: SupportedLanguage;
  residencyStatus: ResidencyStatus;
  nationality: string; // Country name in IT or '__prefer_not__'
  showConsulate: boolean; // Safeguard: if false, never show missions
  onboardingCompleted: boolean;
  simulationMode: LocationSimulationMode;
}

export interface Coordinates {
  lat: number;
  lon: number;
  accuracy?: number;
  isSimulated: boolean;
  name?: string;
}

export const SIMULATED_COORDINATES: Record<Exclude<LocationSimulationMode, 'real'>, Coordinates> = {
  piazza_grande: {
    lat: 44.6466,
    lon: 10.9255,
    isSimulated: true,
    name: 'Piazza Grande, Modena',
  },
  train_station: {
    lat: 44.6546,
    lon: 10.9302,
    isSimulated: true,
    name: 'Estação ferroviária de Modena',
  },
  rome_center: {
    lat: 41.9028,
    lon: 12.4964,
    isSimulated: true,
    name: 'Roma, centro',
  },
};

export const DEFAULT_PROFILE: UserProfile = {
  language: 'pt-BR',
  residencyStatus: 'traveling',
  nationality: '__prefer_not__',
  showConsulate: true,
  onboardingCompleted: false,
  simulationMode: 'piazza_grande', // default to Modena demo test as pilot city
};

const PROFILE_STORAGE_KEY = 'ankora_user_profile_v1';

export function loadStoredProfile(): UserProfile {
  if (typeof window === 'undefined') return DEFAULT_PROFILE;
  try {
    const raw = localStorage.getItem(PROFILE_STORAGE_KEY);
    if (!raw) {
      // Detect browser language if available
      const navLang = navigator.language.split('-')[0];
      let initialLang: SupportedLanguage = 'en';
      if (navigator.language.startsWith('pt')) initialLang = 'pt-BR';
      else if (navLang === 'it') initialLang = 'it';
      else if (navLang === 'uk') initialLang = 'uk';
      else if (navLang === 'ar') initialLang = 'ar';
      else if (navLang === 'es') initialLang = 'es';
      else if (navLang === 'fr') initialLang = 'fr';
      else if (navLang === 'de') initialLang = 'de';
      
      return {
        ...DEFAULT_PROFILE,
        language: initialLang,
      };
    }
    return { ...DEFAULT_PROFILE, ...JSON.parse(raw) };
  } catch {
    return DEFAULT_PROFILE;
  }
}

export function saveStoredProfile(profile: UserProfile): void {
  try {
    localStorage.setItem(PROFILE_STORAGE_KEY, JSON.stringify(profile));
  } catch (e) {
    console.warn('Failed to save profile to localStorage:', e);
  }
}
