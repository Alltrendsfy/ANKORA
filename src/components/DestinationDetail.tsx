import React, { useState, useEffect } from 'react';
import { TranslationDictionary, SupportedLanguage } from '../i18n/translations';
import {
  EmergencyArea,
  Mission,
  calculateBearingDegrees,
  getCardinalDirectionKey,
  formatLocalizedDistance,
} from '../data/ankoraData';
import { Coordinates } from '../types/profile';
import { useDeviceHeading } from '../hooks/useDeviceHeading';
import {
  subscribeAreaReports,
  submitEmergencyReport,
  EcosystemEmergencyReport,
} from '../firebase/ecosystemService';
import { OfflineMapView } from './OfflineMapView';
import {
  ArrowLeft,
  Navigation,
  Compass,
  MapPin,
  ExternalLink,
  FileText,
  Phone,
  ShieldCheck,
  AlertCircle,
  Activity,
  PlusCircle,
  CheckCircle2,
  AlertTriangle,
  Map as MapIcon,
} from 'lucide-react';

interface DestinationDetailProps {
  destination: (EmergencyArea | Mission) & {
    distanceMeters: number;
    destinationType: 'area_espera' | 'consulado' | 'embaixada';
  };
  userCoords: Coordinates;
  t: TranslationDictionary;
  lang: SupportedLanguage;
  dir: 'ltr' | 'rtl';
  onBack: () => void;
  onOpenHelpCard: () => void;
}

export const DestinationDetail: React.FC<DestinationDetailProps> = ({
  destination,
  userCoords,
  t,
  lang,
  dir,
  onBack,
  onOpenHelpCard,
}) => {
  const [viewMode, setViewMode] = useState<'compass' | 'map'>('compass');
  const { heading, requiresPermission, permissionGranted, requestPermission } = useDeviceHeading();
  const [permissionError, setPermissionError] = useState(false);

  // Ecosystem reports state
  const [reports, setReports] = useState<EcosystemEmergencyReport[]>([]);
  const [showReportModal, setShowReportModal] = useState(false);
  const [reportStatus, setReportStatus] = useState<
    'open_clear' | 'crowded' | 'first_aid_present' | 'blocked_access'
  >('open_clear');
  const [reportNote, setReportNote] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitSuccess, setSubmitSuccess] = useState(false);

  useEffect(() => {
    const unsub = subscribeAreaReports(destination.id, (list) => {
      setReports(list);
    });
    return () => unsub();
  }, [destination.id]);

  // Calculate bearing from user to target
  const bearing = calculateBearingDegrees(
    userCoords.lat,
    userCoords.lon,
    destination.lat,
    destination.lon
  );

  // If heading is available, relative needle rotation is bearing - heading
  const needleRotation = heading !== null ? (bearing - heading + 360) % 360 : bearing;

  const cardinalKey = getCardinalDirectionKey(bearing);
  const cardinalText = t[cardinalKey];

  const handleRequestIOSPermission = async () => {
    const ok = await requestPermission();
    if (!ok) {
      setPermissionError(true);
    }
  };

  const mapUrl = `https://www.google.com/maps/dir/?api=1&destination=${destination.lat},${destination.lon}`;

  const isMission = 'pais_iso' in destination || 'pais_nome_it' in destination;
  const mission = isMission ? (destination as Mission) : null;
  const waitingArea = !isMission ? (destination as EmergencyArea) : null;

  const handleSendReport = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    const destName =
      'nome' in destination && destination.nome
        ? destination.nome
        : mission
        ? `${mission.cidade} — ${mission.pais_nome_it}`
        : 'Área de Emergência';

    const ok = await submitEmergencyReport({
      areaId: destination.id,
      areaName: destName,
      status: reportStatus,
      note: reportNote,
    });
    setIsSubmitting(false);
    if (ok) {
      setSubmitSuccess(true);
      setTimeout(() => {
        setSubmitSuccess(false);
        setShowReportModal(false);
        setReportNote('');
      }, 1500);
    }
  };

  return (
    <div className="flex-1 flex flex-col p-4 space-y-4 pb-8" dir={dir}>
      {/* Top back navigation */}
      <div className="flex items-center justify-between">
        <button
          onClick={onBack}
          className="h-10 px-3 -ml-2 rounded-xl flex items-center gap-1.5 text-sm font-semibold text-[#0F2B3D] dark:text-[#E6EDF2] hover:bg-slate-200/60 dark:hover:bg-slate-800 transition active:scale-95"
        >
          <ArrowLeft className="w-5 h-5 rtl-flip" />
          <span>Voltar</span>
        </button>

        <span className="text-xs text-slate-500 font-medium">
          {userCoords.name || (userCoords.isSimulated ? 'Modo Simulado' : 'GPS')}
        </span>
      </div>

      {/* Main Card */}
      <div className="bg-white dark:bg-[#0E1E28] rounded-2xl border border-slate-200 dark:border-slate-800 p-5 shadow-xs flex flex-col items-center text-center space-y-3">
        <div className="flex items-center gap-2">
          {waitingArea && (
            <span className="text-xs font-semibold text-[#0E7C74] bg-[#0E7C74]/10 px-2.5 py-1 rounded-md">
              {t.waitingAreaLabel}
            </span>
          )}
          {mission && (
            <span className="text-xs font-semibold text-[#0F2B3D] dark:text-slate-200 bg-slate-100 dark:bg-slate-800 px-2.5 py-1 rounded-md">
              {mission.tipo === 'embaixada'
                ? t.embassy
                : mission.tipo === 'consulado_carreira'
                ? t.careerConsulate
                : t.honoraryConsulate}
            </span>
          )}
        </div>

        <h1 className="font-sora text-xl text-[#0F2B3D] dark:text-[#E6EDF2] font-semibold leading-tight">
          {'nome' in destination && destination.nome
            ? destination.nome
            : mission
            ? `${mission.cidade} — ${mission.pais_nome_it}`
            : 'Destino'}
        </h1>

        {/* Verification / status badges */}
        {mission && (
          <div className="pt-1 flex flex-wrap justify-center gap-2">
            {mission.verificacao === 'verificado' && (
              <span className="inline-flex items-center gap-1.5 text-xs font-medium text-[#0E7C74] bg-[#0E7C74]/10 px-2.5 py-1 rounded-md">
                <ShieldCheck className="w-3.5 h-3.5" />
                {t.badgeVerified}
              </span>
            )}
            {mission.verificacao === 'em_verificacao' && (
              <span className="inline-flex items-center gap-1.5 text-xs font-medium text-[#B45309] bg-[#FFF4E5] dark:bg-amber-950/40 px-2.5 py-1 rounded-md">
                <AlertCircle className="w-3.5 h-3.5 text-[#B45309]" />
                {t.badgeVerifying}
              </span>
            )}
            {mission.servico_limitado && (
              <span className="inline-flex items-center gap-1.5 text-xs font-medium text-[#B45309] bg-[#FFF4E5] dark:bg-amber-950/40 px-2.5 py-1 rounded-md">
                <AlertCircle className="w-3.5 h-3.5 text-[#B45309]" />
                {t.badgeLimited}
              </span>
            )}
          </div>
        )}

        {/* Segmented Selector: Compass vs Map */}
        <div className="w-full flex items-center p-1 bg-slate-100 dark:bg-slate-800/80 rounded-xl">
          <button
            type="button"
            onClick={() => setViewMode('compass')}
            className={`flex-1 py-1.5 text-xs font-semibold rounded-lg transition-all flex items-center justify-center gap-1.5 ${
              viewMode === 'compass'
                ? 'bg-white dark:bg-[#0F2B3D] text-[#0F2B3D] dark:text-white shadow-xs'
                : 'text-[#4A5C6A] dark:text-slate-400 hover:text-slate-900'
            }`}
          >
            <Compass className="w-3.5 h-3.5 text-[#F26A21]" />
            <span>Bússola Direcional</span>
          </button>
          <button
            type="button"
            onClick={() => setViewMode('map')}
            className={`flex-1 py-1.5 text-xs font-semibold rounded-lg transition-all flex items-center justify-center gap-1.5 ${
              viewMode === 'map'
                ? 'bg-white dark:bg-[#0F2B3D] text-[#0F2B3D] dark:text-white shadow-xs'
                : 'text-[#4A5C6A] dark:text-slate-400 hover:text-slate-900'
            }`}
          >
            <MapIcon className="w-3.5 h-3.5 text-[#0E7C74]" />
            <span>Mapa Visual</span>
          </button>
        </div>

        {/* View Mode: Compass or Offline Map */}
        {viewMode === 'compass' ? (
          <div className="py-2 flex flex-col items-center w-full">
            <div className="relative w-44 h-44 rounded-full border-4 border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-[#0A1720] flex items-center justify-center shadow-inner">
              <span className="absolute top-2 text-[10px] font-bold text-slate-400">N</span>
              <span className="absolute bottom-2 text-[10px] font-bold text-slate-400">S</span>
              <span className="absolute right-2 text-[10px] font-bold text-slate-400">L</span>
              <span className="absolute left-2 text-[10px] font-bold text-slate-400">O</span>

              {/* Rotating Needle pointing towards destination */}
              <div
                className="absolute inset-0 flex items-center justify-center transition-transform duration-300 ease-out"
                style={{ transform: `rotate(${needleRotation}deg)` }}
              >
                <div className="flex flex-col items-center -translate-y-5">
                  <div className="w-0 h-0 border-x-[14px] border-x-transparent border-b-[40px] border-b-[#F26A21] drop-shadow-sm" />
                  <div className="w-2.5 h-10 bg-[#0F2B3D] dark:bg-slate-300 rounded-b-sm" />
                </div>
              </div>

              <div className="w-6 h-6 rounded-full bg-[#0F2B3D] dark:bg-white border-2 border-white dark:border-[#0F2B3D] z-10 shadow-sm" />
            </div>

            {/* Real-time distance and cardinal fallback */}
            <div className="mt-3">
              <p className="font-sora text-3xl font-bold text-[#0F2B3D] dark:text-[#E6EDF2]">
                {formatLocalizedDistance(destination.distanceMeters, lang)}
              </p>
              <p className="text-xs text-[#4A5C6A] dark:text-slate-400 mt-0.5 font-medium">
                {cardinalText} · {Math.round(bearing)}°
              </p>
            </div>

            {/* Compass permission for iOS if needed */}
            {requiresPermission && !permissionGranted && (
              <button
                onClick={handleRequestIOSPermission}
                className="mt-2 text-xs flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-slate-300 dark:border-slate-700 text-[#0F2B3D] dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition"
              >
                <Compass className="w-3.5 h-3.5 text-[#0E7C74]" />
                {t.enableCompassIOS}
              </button>
            )}
            {permissionError && (
              <p className="text-[11px] text-amber-600 mt-1">
                Orientação do aparelho indisponível. Usando rumo estático.
              </p>
            )}
          </div>
        ) : (
          /* Offline Map View (Leaflet) */
          <div className="w-full py-1">
            <OfflineMapView
              userCoords={userCoords}
              destCoords={{
                lat: destination.lat,
                lon: destination.lon,
                nome:
                  'nome' in destination && destination.nome
                    ? destination.nome
                    : mission
                    ? `${mission.cidade} — ${mission.pais_nome_it}`
                    : 'Destino',
                endereco: destination.endereco,
              }}
              distanceMeters={destination.distanceMeters}
              bearing={bearing}
              lang={lang}
              className="h-[280px]"
            />
          </div>
        )}

        {/* Address */}
        <div className="w-full text-left pt-2 border-t border-slate-100 dark:border-slate-800/80">
          <p className="text-[11px] uppercase tracking-wider font-semibold text-[#4A5C6A] dark:text-slate-400 flex items-center gap-1">
            <MapPin className="w-3.5 h-3.5 text-[#0E7C74]" />
            {t.addressLabel}
          </p>
          <p className="text-sm font-semibold text-[#0F2B3D] dark:text-[#E6EDF2] mt-1">
            {destination.endereco || 'Modena, Itália'}
          </p>
        </div>

        {/* Phone call if mission has main phone */}
        {mission?.telefone_principal && (
          <a
            href={`tel:${mission.telefone_principal}`}
            className="w-full h-12 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-900/60 text-[#0F2B3D] dark:text-slate-200 text-sm font-semibold flex items-center justify-center gap-2 hover:bg-slate-100 dark:hover:bg-slate-800 transition active:scale-[0.99]"
          >
            <Phone className="w-4 h-4 text-[#0E7C74]" />
            <span>
              {t.callBtn} {mission.telefone_principal}
            </span>
          </a>
        )}
      </div>

      {/* Ecosystem Status & Field Reports Card (Firebase Firestore) */}
      <div className="bg-white dark:bg-[#0E1E28] rounded-2xl border border-slate-200 dark:border-slate-800 p-4 shadow-xs space-y-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-1.5">
            <Activity className="w-4 h-4 text-[#0E7C74]" />
            <h3 className="font-sora text-xs font-semibold text-[#0F2B3D] dark:text-slate-200 uppercase tracking-wider">
              Ecossistema em Tempo Real
            </h3>
          </div>
          <button
            onClick={() => setShowReportModal(true)}
            className="text-xs text-[#0E7C74] font-semibold flex items-center gap-1 hover:underline"
          >
            <PlusCircle className="w-3.5 h-3.5" />
            <span>Informar status</span>
          </button>
        </div>

        {reports.length === 0 ? (
          <p className="text-xs text-slate-500">
            Nenhum alerta recente registrado no ecossistema para este local.
          </p>
        ) : (
          <div className="space-y-2">
            {reports.slice(0, 2).map((rep) => (
              <div
                key={rep.id}
                className="p-2.5 rounded-xl bg-slate-50 dark:bg-slate-900/60 border border-slate-200 dark:border-slate-800 flex items-start gap-2 text-xs"
              >
                {rep.status === 'open_clear' && (
                  <CheckCircle2 className="w-4 h-4 text-[#0E7C74] shrink-0 mt-0.5" />
                )}
                {rep.status === 'first_aid_present' && (
                  <ShieldCheck className="w-4 h-4 text-[#0E7C74] shrink-0 mt-0.5" />
                )}
                {rep.status === 'crowded' && (
                  <AlertCircle className="w-4 h-4 text-[#B45309] shrink-0 mt-0.5" />
                )}
                {rep.status === 'blocked_access' && (
                  <AlertTriangle className="w-4 h-4 text-red-600 shrink-0 mt-0.5" />
                )}
                <div className="flex-1">
                  <div className="flex items-center justify-between">
                    <span className="font-semibold text-[#0F2B3D] dark:text-white">
                      {rep.status === 'open_clear'
                        ? 'Área desobstruída'
                        : rep.status === 'first_aid_present'
                        ? 'Primeiros socorros presentes'
                        : rep.status === 'crowded'
                        ? 'Alta concentração'
                        : 'Acesso bloqueado'}
                    </span>
                    <span className="text-[10px] text-slate-400 font-mono">
                      {new Date(rep.createdAt).toLocaleTimeString([], {
                        hour: '2-digit',
                        minute: '2-digit',
                      })}
                    </span>
                  </div>
                  {rep.note && (
                    <p className="text-[11px] text-slate-600 dark:text-slate-300 mt-0.5">
                      {rep.note}
                    </p>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Primary Action 1: Show Help Card */}
      <button
        onClick={onOpenHelpCard}
        className="w-full h-14 rounded-2xl bg-[#0F2B3D] dark:bg-white text-white dark:text-[#0F2B3D] font-sora text-base font-semibold shadow-md hover:opacity-95 active:scale-[0.99] transition flex items-center justify-center gap-2.5"
      >
        <FileText className="w-5 h-5 text-[#F26A21]" />
        <span>{t.showHelpCard}</span>
      </button>

      {/* Action 2: Open Map Route (only works online) */}
      <a
        href={mapUrl}
        target="_blank"
        rel="noopener noreferrer"
        className="w-full h-12 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-[#4A5C6A] dark:text-slate-300 text-xs font-semibold flex items-center justify-center gap-2 hover:bg-slate-50 dark:hover:bg-slate-700 transition"
      >
        <Navigation className="w-4 h-4 text-[#0E7C74]" />
        <span>{t.openMapRoute}</span>
        <span className="text-[11px] opacity-75">{t.openMapRouteNote}</span>
        <ExternalLink className="w-3.5 h-3.5 opacity-60 ml-0.5" />
      </a>

      {/* Modal to Submit Emergency Condition */}
      {showReportModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4">
          <form
            onSubmit={handleSendReport}
            className="w-full max-w-sm bg-white dark:bg-[#0A1720] border border-slate-200 dark:border-slate-800 rounded-2xl p-5 space-y-4 shadow-2xl animate-in fade-in"
          >
            <div className="flex items-center justify-between pb-2 border-b border-slate-100 dark:border-slate-800">
              <h3 className="font-sora text-sm font-semibold text-[#0F2B3D] dark:text-white">
                Informar Condição da Área
              </h3>
              <button
                type="button"
                onClick={() => setShowReportModal(false)}
                className="text-xs text-slate-500 hover:text-slate-800 dark:hover:text-slate-200 p-1"
              >
                ✕
              </button>
            </div>

            <div className="space-y-2">
              <label className="text-xs font-medium text-slate-600 dark:text-slate-300">
                Condição atual:
              </label>
              <div className="grid grid-cols-2 gap-2 text-xs">
                <button
                  type="button"
                  onClick={() => setReportStatus('open_clear')}
                  className={`p-2.5 rounded-xl border text-left font-medium transition ${
                    reportStatus === 'open_clear'
                      ? 'border-[#0E7C74] bg-[#0E7C74]/10 text-[#0E7C74]'
                      : 'border-slate-200 dark:border-slate-800 text-slate-700 dark:text-slate-300'
                  }`}
                >
                  Área Desobstruída
                </button>
                <button
                  type="button"
                  onClick={() => setReportStatus('first_aid_present')}
                  className={`p-2.5 rounded-xl border text-left font-medium transition ${
                    reportStatus === 'first_aid_present'
                      ? 'border-[#0E7C74] bg-[#0E7C74]/10 text-[#0E7C74]'
                      : 'border-slate-200 dark:border-slate-800 text-slate-700 dark:text-slate-300'
                  }`}
                >
                  Socorro Presente
                </button>
                <button
                  type="button"
                  onClick={() => setReportStatus('crowded')}
                  className={`p-2.5 rounded-xl border text-left font-medium transition ${
                    reportStatus === 'crowded'
                      ? 'border-[#B45309] bg-[#FFF4E5] dark:bg-amber-950/40 text-[#B45309]'
                      : 'border-slate-200 dark:border-slate-800 text-slate-700 dark:text-slate-300'
                  }`}
                >
                  Alta Concentração
                </button>
                <button
                  type="button"
                  onClick={() => setReportStatus('blocked_access')}
                  className={`p-2.5 rounded-xl border text-left font-medium transition ${
                    reportStatus === 'blocked_access'
                      ? 'border-red-500 bg-red-50 dark:bg-red-950/40 text-red-600'
                      : 'border-slate-200 dark:border-slate-800 text-slate-700 dark:text-slate-300'
                  }`}
                >
                  Acesso Bloqueado
                </button>
              </div>
            </div>

            <div className="space-y-1">
              <label className="text-xs font-medium text-slate-600 dark:text-slate-300">
                Observação (opcional):
              </label>
              <textarea
                value={reportNote}
                onChange={(e) => setReportNote(e.target.value)}
                maxLength={500}
                placeholder="Ex.: Entrada pelo portão sul desimpedida."
                className="w-full h-20 p-2.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-900 text-xs focus:ring-2 focus:ring-[#0E7C74] focus:outline-hidden"
              />
            </div>

            {submitSuccess && (
              <p className="text-xs text-emerald-600 font-semibold text-center">
                Informação enviada ao ecossistema com sucesso!
              </p>
            )}

            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full h-11 rounded-xl bg-[#0F2B3D] dark:bg-white text-white dark:text-[#0F2B3D] font-sora text-xs font-semibold shadow-xs hover:opacity-95 transition disabled:opacity-50"
            >
              {isSubmitting ? 'Enviando…' : 'Publicar no Ecossistema'}
            </button>
          </form>
        </div>
      )}
    </div>
  );
};
