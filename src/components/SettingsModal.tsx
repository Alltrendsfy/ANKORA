import React, { useState } from 'react';
import { TranslationDictionary, SupportedLanguage } from '../i18n/translations';
import { UserProfile, LocationSimulationMode, SIMULATED_COORDINATES } from '../types/profile';
import { ANKORA_DATA } from '../data/ankoraData';
import { usePWAInstall } from '../hooks/usePWA';
import { testConnection } from '../firebase/config';
import { syncOfficialPackage } from '../firebase/ecosystemService';
import firebaseConfig from '../../firebase-applet-config.json';
import {
  X,
  MapPin,
  Smartphone,
  Shield,
  Info,
  Download,
  Check,
  Radio,
  ExternalLink,
  Database,
  RefreshCw,
  CheckCircle2,
  Server,
} from 'lucide-react';

interface SettingsModalProps {
  profile: UserProfile;
  t: TranslationDictionary;
  lang: SupportedLanguage;
  dir: 'ltr' | 'rtl';
  onUpdateProfile: (updated: Partial<UserProfile>) => void;
  onOpenEditProfile: () => void;
  onClose: () => void;
}

export const SettingsModal: React.FC<SettingsModalProps> = ({
  profile,
  t,
  lang,
  dir,
  onUpdateProfile,
  onOpenEditProfile,
  onClose,
}) => {
  const [activeSubTab, setActiveSubTab] = useState<'simulation' | 'ecosystem' | 'about'>('simulation');
  const { isInstallable, isInstalled, isIOS, install } = usePWAInstall();
  const [showIOSGuide, setShowIOSGuide] = useState(false);

  // Firestore status state
  const [testingConnection, setTestingConnection] = useState(false);
  const [connectionStatus, setConnectionStatus] = useState<string | null>(null);
  const [syncingPackage, setSyncingPackage] = useState(false);
  const [syncSuccess, setSyncSuccess] = useState(false);

  const handleTestConnection = async () => {
    setTestingConnection(true);
    setConnectionStatus(null);
    const ok = await testConnection();
    setTestingConnection(false);
    setConnectionStatus(ok ? 'Conexão ativa e sincronizada!' : 'Banco acessível em modo offline/cache.');
  };

  const handleSyncPackage = async () => {
    setSyncingPackage(true);
    setSyncSuccess(false);
    await syncOfficialPackage();
    setSyncingPackage(false);
    setSyncSuccess(true);
    setTimeout(() => setSyncSuccess(false), 2500);
  };

  const simulationOptions: {
    mode: LocationSimulationMode;
    label: string;
    sub: string;
  }[] = [
    {
      mode: 'piazza_grande',
      label: t.simulatePiazzaGrande,
      sub: '44.6466, 10.9255 · Modena',
    },
    {
      mode: 'train_station',
      label: t.simulateTrainStation,
      sub: '44.6546, 10.9302 · Modena',
    },
    {
      mode: 'rome_center',
      label: t.simulateRomeCenter,
      sub: '41.9028, 12.4964 · Roma',
    },
    {
      mode: 'real',
      label: t.simulateRealGPS,
      sub: 'navigator.geolocation',
    },
  ];

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/65 backdrop-blur-xs p-3 overflow-y-auto"
      dir={dir}
    >
      <div className="w-full max-w-[430px] my-auto bg-white dark:bg-[#0A1720] border border-slate-200 dark:border-slate-800 rounded-2xl shadow-2xl p-5 text-[#0F2B3D] dark:text-[#E6EDF2] flex flex-col gap-4 animate-in fade-in duration-200">
        {/* Header with 3 Tabs */}
        <div className="flex items-center justify-between pb-2 border-b border-slate-100 dark:border-slate-800">
          <div className="flex items-center gap-1 p-1 bg-slate-100 dark:bg-slate-800/80 rounded-lg overflow-x-auto">
            <button
              onClick={() => setActiveSubTab('simulation')}
              className={`px-2.5 py-1 text-xs font-semibold rounded-md transition whitespace-nowrap ${
                activeSubTab === 'simulation'
                  ? 'bg-white dark:bg-[#0F2B3D] text-[#0F2B3D] dark:text-white shadow-xs'
                  : 'text-slate-600 dark:text-slate-400'
              }`}
            >
              GPS / Teste
            </button>
            <button
              onClick={() => setActiveSubTab('ecosystem')}
              className={`px-2.5 py-1 text-xs font-semibold rounded-md transition whitespace-nowrap ${
                activeSubTab === 'ecosystem'
                  ? 'bg-white dark:bg-[#0F2B3D] text-[#0F2B3D] dark:text-white shadow-xs'
                  : 'text-slate-600 dark:text-slate-400'
              }`}
            >
              Ecossistema
            </button>
            <button
              onClick={() => setActiveSubTab('about')}
              className={`px-2.5 py-1 text-xs font-semibold rounded-md transition whitespace-nowrap ${
                activeSubTab === 'about'
                  ? 'bg-white dark:bg-[#0F2B3D] text-[#0F2B3D] dark:text-white shadow-xs'
                  : 'text-slate-600 dark:text-slate-400'
              }`}
            >
              Dados
            </button>
          </div>

          <button
            onClick={onClose}
            aria-label="Fechar"
            className="h-8 w-8 flex items-center justify-center rounded-full bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-600 dark:text-slate-300 transition shrink-0"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {activeSubTab === 'simulation' && (
          <div className="space-y-4">
            {/* Simulation options */}
            <div className="space-y-2">
              <div className="flex items-center gap-1.5">
                <MapPin className="w-4 h-4 text-[#0E7C74]" />
                <h3 className="font-sora text-sm font-semibold text-[#0F2B3D] dark:text-slate-200">
                  {t.simulateLocation}
                </h3>
              </div>
              <p className="text-[11px] text-[#4A5C6A] dark:text-slate-400 leading-normal">
                Permite testar os cálculos de distância, bússola e áreas de espera sem precisar estar na Itália.
              </p>

              <div className="space-y-2 pt-1">
                {simulationOptions.map((opt) => {
                  const isSelected = profile.simulationMode === opt.mode;
                  return (
                    <button
                      key={opt.mode}
                      onClick={() => onUpdateProfile({ simulationMode: opt.mode })}
                      className={`w-full p-3 rounded-xl border text-left flex items-center justify-between transition-all ${
                        isSelected
                          ? 'border-[#0E7C74] bg-[#0E7C74]/10 shadow-xs'
                          : 'border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-900/60 hover:border-slate-300'
                      }`}
                    >
                      <div>
                        <p className="text-xs font-semibold text-[#0F2B3D] dark:text-[#E6EDF2]">
                          {opt.label}
                        </p>
                        <p className="text-[11px] text-slate-500 mt-0.5 font-mono">
                          {opt.sub}
                        </p>
                      </div>
                      <div
                        className={`w-5 h-5 rounded-full border-2 flex items-center justify-center ${
                          isSelected
                            ? 'border-[#0E7C74] bg-[#0E7C74]'
                            : 'border-slate-300 dark:border-slate-600'
                        }`}
                      >
                        {isSelected && <div className="w-2 h-2 rounded-full bg-white" />}
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Profile & Safeguard quick access */}
            <div className="pt-2 border-t border-slate-100 dark:border-slate-800 space-y-2">
              <h4 className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
                Perfil & Salvaguarda
              </h4>
              <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-900/60 border border-slate-200 dark:border-slate-800 flex items-center justify-between">
                <div>
                  <p className="text-xs font-semibold text-[#0F2B3D] dark:text-slate-200">
                    Nacionalidade: {profile.nationality === '__prefer_not__' ? 'Oculta' : profile.nationality}
                  </p>
                  <p className="text-[11px] text-[#4A5C6A] dark:text-slate-400 mt-0.5">
                    Consulado: {profile.showConsulate ? 'Visível' : 'Oculto (Salvaguarda ativa)'}
                  </p>
                </div>
                <button
                  onClick={onOpenEditProfile}
                  className="px-3 py-1.5 rounded-lg bg-[#0F2B3D] dark:bg-white text-white dark:text-[#0F2B3D] text-xs font-semibold shadow-xs"
                >
                  Editar
                </button>
              </div>
            </div>

            {/* In-app PWA install button */}
            <div className="pt-2 border-t border-slate-100 dark:border-slate-800">
              {isInstalled ? (
                <div className="p-2.5 rounded-xl bg-emerald-50 dark:bg-emerald-950/30 text-emerald-800 dark:text-emerald-300 text-xs flex items-center gap-2">
                  <Check className="w-4 h-4 text-emerald-600" />
                  <span>Aplicativo instalado no seu dispositivo.</span>
                </div>
              ) : isInstallable ? (
                <button
                  onClick={install}
                  className="w-full h-11 rounded-xl bg-[#0F2B3D] dark:bg-white text-white dark:text-[#0F2B3D] font-sora text-xs font-semibold flex items-center justify-center gap-2 shadow-xs transition hover:opacity-95"
                >
                  <Download className="w-4 h-4 text-[#F26A21]" />
                  <span>{t.installApp}</span>
                </button>
              ) : isIOS ? (
                <>
                  <button
                    onClick={() => setShowIOSGuide(true)}
                    className="w-full h-11 rounded-xl border border-slate-300 dark:border-slate-700 text-[#0F2B3D] dark:text-slate-200 font-sora text-xs font-semibold flex items-center justify-center gap-2 hover:bg-slate-50 dark:hover:bg-slate-800 transition"
                  >
                    <Smartphone className="w-4 h-4 text-[#0E7C74]" />
                    <span>Instalar no iPhone (Safari)</span>
                  </button>

                  {showIOSGuide && (
                    <div className="p-3 mt-2 bg-slate-100 dark:bg-slate-800 rounded-xl text-xs space-y-1 text-slate-700 dark:text-slate-300">
                      <p className="font-semibold text-[#0F2B3D] dark:text-white">Para instalar no iOS:</p>
                      <p>1. Toque no botão <strong>Compartilhar</strong> no Safari.</p>
                      <p>2. Role para baixo e selecione <strong>Adicionar à Tela de Início</strong>.</p>
                    </div>
                  )}
                </>
              ) : null}
            </div>
          </div>
        )}

        {/* TAB 2: ECOSSISTEMA / BANCO DE DADOS */}
        {activeSubTab === 'ecosystem' && (
          <div className="space-y-4">
            <div className="p-3.5 rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 space-y-2">
              <div className="flex items-center gap-2 text-[#0E7C74]">
                <Database className="w-4 h-4" />
                <h4 className="font-sora text-xs font-bold uppercase tracking-wider">
                  Firebase Firestore provisionado
                </h4>
              </div>
              <div className="text-xs text-slate-600 dark:text-slate-300 space-y-1 font-mono text-[11px]">
                <p>
                  <strong>Projeto:</strong> {firebaseConfig.projectId}
                </p>
                <p className="break-all">
                  <strong>Database ID:</strong> {firebaseConfig.firestoreDatabaseId}
                </p>
                <p>
                  <strong>Coleções ativas:</strong> official_packages, emergency_reports, users
                </p>
              </div>
            </div>

            <div className="space-y-2">
              <button
                onClick={handleTestConnection}
                disabled={testingConnection}
                className="w-full h-11 rounded-xl bg-slate-100 dark:bg-slate-800 text-[#0F2B3D] dark:text-slate-200 text-xs font-semibold flex items-center justify-center gap-2 hover:bg-slate-200 transition disabled:opacity-50"
              >
                <Server className="w-4 h-4 text-[#0E7C74]" />
                <span>{testingConnection ? 'Testando conexão…' : 'Validar Conexão com Firestore'}</span>
              </button>

              {connectionStatus && (
                <p className="text-xs text-emerald-600 dark:text-emerald-400 font-medium text-center">
                  {connectionStatus}
                </p>
              )}

              <button
                onClick={handleSyncPackage}
                disabled={syncingPackage}
                className="w-full h-11 rounded-xl bg-[#0F2B3D] dark:bg-white text-white dark:text-[#0F2B3D] text-xs font-semibold flex items-center justify-center gap-2 hover:opacity-95 transition disabled:opacity-50"
              >
                <RefreshCw className={`w-4 h-4 text-[#F26A21] ${syncingPackage ? 'animate-spin' : ''}`} />
                <span>{syncingPackage ? 'Sincronizando…' : 'Sincronizar Pacote Oficial IT-MO'}</span>
              </button>

              {syncSuccess && (
                <p className="text-xs text-emerald-600 dark:text-emerald-400 font-semibold text-center flex items-center justify-center gap-1">
                  <CheckCircle2 className="w-3.5 h-3.5" />
                  <span>Pacote IT-MO sincronizado no Firestore!</span>
                </p>
              )}
            </div>

            <div className="p-3 rounded-xl bg-[#FFF4E5] dark:bg-amber-950/20 border border-amber-200 dark:border-amber-900/40 text-[11px] text-[#B45309] dark:text-amber-300 leading-normal">
              <strong>Arquitetura Híbrida:</strong> Em caso de perda total de sinal (modo avião), a base de dados do aparelho assume 100% da operação instantaneamente via IndexedDB.
            </div>
          </div>
        )}

        {/* TAB 3: SOBRE OS DADOS & ATRIBUIÇÕES */}
        {activeSubTab === 'about' && (
          <div className="space-y-4">
            <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 space-y-2">
              <h4 className="font-sora text-xs font-bold uppercase tracking-wider text-[#0E7C74]">
                Pacote de Dados: {ANKORA_DATA.pacote}
              </h4>
              <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed">
                Versão: <strong>{ANKORA_DATA.versao_dados}</strong> · Cidade-piloto:{' '}
                <strong>{ANKORA_DATA.cidade_piloto}</strong> · Emergência:{' '}
                <strong>{ANKORA_DATA.numero_emergencia}</strong>
              </p>
            </div>

            <div className="space-y-2">
              <h4 className="text-xs font-semibold text-[#0F2B3D] dark:text-white flex items-center gap-1.5">
                <Shield className="w-4 h-4 text-[#0E7C74]" />
                <span>Atribuição e Fontes Oficiais</span>
              </h4>
              <ul className="space-y-2 text-xs text-[#4A5C6A] dark:text-slate-300">
                {ANKORA_DATA.atribuicao.map((item, idx) => (
                  <li
                    key={idx}
                    className="p-2.5 rounded-lg bg-slate-50 dark:bg-slate-900/60 border border-slate-200 dark:border-slate-800 leading-relaxed"
                  >
                    {item}
                  </li>
                ))}
              </ul>
            </div>

            <div className="p-3 rounded-xl bg-[#FFF4E5] dark:bg-amber-950/20 border border-amber-200 dark:border-amber-900/40 text-[11px] text-[#B45309] dark:text-amber-300 leading-normal">
              <strong>Privacidade estrita:</strong> O aplicativo Ankora não possui cookies rastreadores ou venda de dados. Sua localização nunca é exposta.
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
