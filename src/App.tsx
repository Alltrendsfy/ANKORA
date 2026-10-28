import React, { useState, useEffect } from 'react';
import {
  UserProfile,
  DEFAULT_PROFILE,
  loadStoredProfile,
  saveStoredProfile,
} from './types/profile';
import {
  EmergencyArea,
  Mission,
  ANKORA_DATA,
  saveToIndexedDB,
  loadFromIndexedDB,
} from './data/ankoraData';
import { getTranslation, SUPPORTED_LANGUAGES } from './i18n/translations';
import { useUserLocation } from './hooks/useUserLocation';
import { useOnlineStatus } from './hooks/usePWA';
import { testConnection } from './firebase/config';
import { syncOfficialPackage } from './firebase/ecosystemService';

import { DemoBanner } from './components/DemoBanner';
import { OnboardingModal } from './components/OnboardingModal';
import { HomeScreen } from './components/HomeScreen';
import { DestinationsList } from './components/DestinationsList';
import { DestinationDetail } from './components/DestinationDetail';
import { HelpCard } from './components/HelpCard';
import { SettingsModal } from './components/SettingsModal';

type ActiveView = 'home' | 'destinations' | 'detail';

type SelectedDestination = (EmergencyArea | Mission) & {
  distanceMeters: number;
  destinationType: 'area_espera' | 'consulado' | 'embaixada';
};

export default function App() {
  const [profile, setProfile] = useState<UserProfile>(loadStoredProfile);
  const [showOnboarding, setShowOnboarding] = useState<boolean>(!profile.onboardingCompleted);
  const [showSettings, setShowSettings] = useState<boolean>(false);
  const [activeView, setActiveView] = useState<ActiveView>('home');
  const [selectedDest, setSelectedDest] = useState<SelectedDestination | null>(null);
  const [showHelpCard, setShowHelpCard] = useState<boolean>(false);

  // Online status & Geolocation
  const isOnline = useOnlineStatus();
  const { coords: userCoords, gpsActive } = useUserLocation(profile.simulationMode);

  // Sync translation & document direction
  const t = getTranslation(profile.language);
  const langMeta = SUPPORTED_LANGUAGES.find((l) => l.code === profile.language);
  const dir = langMeta?.dir || 'ltr';

  // Apply RTL and language attribute to html/body
  useEffect(() => {
    document.documentElement.setAttribute('lang', profile.language);
    document.documentElement.setAttribute('dir', dir);
  }, [profile.language, dir]);

  // Seed IndexedDB and validate ecosystem Firestore connection on mount
  useEffect(() => {
    (async () => {
      try {
        const cached = await loadFromIndexedDB();
        if (!cached) {
          await saveToIndexedDB(ANKORA_DATA);
        }
      } catch (e) {
        console.warn('IndexedDB initial cache warning:', e);
      }

      // Test connection to Firestore & sync package
      try {
        await testConnection();
        await syncOfficialPackage();
      } catch (err) {
        console.warn('Ecosystem Firestore boot note:', err);
      }
    })();
  }, []);

  const handleSaveProfile = (newProfile: UserProfile) => {
    setProfile(newProfile);
    saveStoredProfile(newProfile);
    setShowOnboarding(false);
  };

  const handleUpdateProfilePartial = (partial: Partial<UserProfile>) => {
    const updated = { ...profile, ...partial };
    setProfile(updated);
    saveStoredProfile(updated);
  };

  const handleSelectDestination = (dest: SelectedDestination) => {
    setSelectedDest(dest);
    setActiveView('detail'); // Touch 2!
  };

  return (
    <div className="min-h-screen bg-[#E5E9EC] dark:bg-[#050A0E] flex items-center justify-center sm:py-4">
      {/* Container: 390x844 reference, max 430px column on desktop */}
      <div className="w-full sm:max-w-[430px] min-h-screen sm:min-h-[844px] sm:max-h-[920px] bg-[#F3F5F7] dark:bg-[#0A1720] text-[#0F2B3D] dark:text-[#E6EDF2] flex flex-col sm:rounded-[36px] shadow-2xl sm:border sm:border-slate-300 dark:sm:border-slate-800 overflow-hidden relative">
        
        {/* Discrete Demo Banner on ALL screens */}
        <DemoBanner t={t} />

        {/* Dynamic View Flow */}
        <main className="flex-1 flex flex-col overflow-y-auto">
          {activeView === 'home' && (
            <HomeScreen
              profile={profile}
              userCoords={userCoords}
              gpsActive={gpsActive}
              isOnline={isOnline}
              t={t}
              lang={profile.language}
              dir={dir}
              onNeedHelp={() => setActiveView('destinations')} // Touch 1!
              onOpenSettings={() => setShowSettings(true)}
            />
          )}

          {activeView === 'destinations' && (
            <DestinationsList
              userCoords={userCoords}
              profile={profile}
              t={t}
              lang={profile.language}
              dir={dir}
              onSelectDestination={handleSelectDestination}
              onBackToHome={() => setActiveView('home')}
            />
          )}

          {activeView === 'detail' && selectedDest && (
            <DestinationDetail
              destination={selectedDest}
              userCoords={userCoords}
              t={t}
              lang={profile.language}
              dir={dir}
              onBack={() => setActiveView('destinations')}
              onOpenHelpCard={() => setShowHelpCard(true)} // Touch 3!
            />
          )}
        </main>

        {/* Touch 3 Fullscreen Help Card */}
        {showHelpCard && selectedDest && (
          <HelpCard
            destinationName={
              ('nome' in selectedDest && selectedDest.nome) ||
              ('cidade' in selectedDest ? `${selectedDest.cidade} — ${selectedDest.pais_nome_it}` : 'Modena')
            }
            destinationAddress={selectedDest.endereco || 'Modena, Itália'}
            t={t}
            onClose={() => setShowHelpCard(false)}
            dir={dir}
          />
        )}

        {/* Step 1 Profile / First Opening Modal */}
        {showOnboarding && (
          <OnboardingModal
            initialProfile={profile}
            onSave={handleSaveProfile}
            isEditing={false}
          />
        )}

        {/* Settings & Simulation Modal */}
        {showSettings && (
          <SettingsModal
            profile={profile}
            t={t}
            lang={profile.language}
            dir={dir}
            onUpdateProfile={handleUpdateProfilePartial}
            onOpenEditProfile={() => {
              setShowSettings(false);
              setShowOnboarding(true);
            }}
            onClose={() => setShowSettings(false)}
          />
        )}
      </div>
    </div>
  );
}
