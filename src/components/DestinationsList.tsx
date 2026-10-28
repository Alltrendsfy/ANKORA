import React, { useState, useMemo } from 'react';
import { TranslationDictionary, SupportedLanguage } from '../i18n/translations';
import {
  EmergencyArea,
  Mission,
  MissionOutside,
  ANKORA_DATA,
  calculateHaversineDistanceMeters,
  calculateBearingDegrees,
  formatLocalizedDistance,
} from '../data/ankoraData';
import { UserProfile, Coordinates } from '../types/profile';
import {
  PhoneCall,
  ShieldCheck,
  AlertCircle,
  MapPin,
  ArrowRight,
  Phone,
  Compass,
  Building,
  Flag,
  ArrowLeft,
} from 'lucide-react';

interface DestinationsListProps {
  userCoords: Coordinates;
  profile: UserProfile;
  t: TranslationDictionary;
  lang: SupportedLanguage;
  dir: 'ltr' | 'rtl';
  onSelectDestination: (
    dest: (EmergencyArea | Mission) & {
      distanceMeters: number;
      destinationType: 'area_espera' | 'consulado' | 'embaixada';
    }
  ) => void;
  onBackToHome: () => void;
}

type TabType = 'waiting_areas' | 'my_consulate' | 'all_embassies';

export const DestinationsList: React.FC<DestinationsListProps> = ({
  userCoords,
  profile,
  t,
  lang,
  dir,
  onSelectDestination,
  onBackToHome,
}) => {
  const [activeTab, setActiveTab] = useState<TabType>('waiting_areas');
  const [showAllWaitingAreas, setShowAllWaitingAreas] = useState(false);

  // 1. Calculate & sort waiting areas (only tipo === 'area_espera' per PRD rule)
  const waitingAreas = useMemo(() => {
    return ANKORA_DATA.areas_emergencia_modena
      .filter((a) => a.tipo === 'area_espera')
      .map((a) => {
        const dist = calculateHaversineDistanceMeters(
          userCoords.lat,
          userCoords.lon,
          a.lat,
          a.lon
        );
        const bearing = calculateBearingDegrees(
          userCoords.lat,
          userCoords.lon,
          a.lat,
          a.lon
        );
        return {
          ...a,
          distanceMeters: dist,
          bearing,
          destinationType: 'area_espera' as const,
        };
      })
      .sort((a, b) => a.distanceMeters - b.distanceMeters);
  }, [userCoords]);

  // 2. User's consulate / embassy (if safeguard allows and nationality chosen)
  const { userMissions, outsideMission } = useMemo(() => {
    if (!profile.showConsulate || profile.nationality === '__prefer_not__') {
      return { userMissions: [], outsideMission: null };
    }

    const matches = ANKORA_DATA.missoes_com_coordenada
      .filter(
        (m) =>
          m.pais_nome_it.toLowerCase() === profile.nationality.toLowerCase()
      )
      .map((m) => {
        const dist = calculateHaversineDistanceMeters(
          userCoords.lat,
          userCoords.lon,
          m.lat,
          m.lon
        );
        const bearing = calculateBearingDegrees(
          userCoords.lat,
          userCoords.lon,
          m.lat,
          m.lon
        );
        return {
          ...m,
          nome: `${m.cidade} — ${m.pais_nome_it}`,
          distanceMeters: dist,
          bearing,
          destinationType: (m.tipo === 'embaixada' ? 'embaixada' : 'consulado') as 'consulado' | 'embaixada',
        };
      })
      .sort((a, b) => a.distanceMeters - b.distanceMeters);

    let outside: MissionOutside | null = null;
    if (matches.length === 0) {
      outside =
        ANKORA_DATA.embaixadas_fora_da_italia.find(
          (e) =>
            e.pais_nome_it.toLowerCase() === profile.nationality.toLowerCase()
        ) || null;
    }

    return { userMissions: matches, outsideMission: outside };
  }, [profile.showConsulate, profile.nationality, userCoords]);

  // 3. Other missions / embassies
  const otherMissions = useMemo(() => {
    if (!profile.showConsulate) {
      // If safeguard is off, filter out user's country if specified
      return ANKORA_DATA.missoes_com_coordenada
        .filter((m) => m.pais_nome_it !== profile.nationality)
        .map((m) => {
          const dist = calculateHaversineDistanceMeters(
            userCoords.lat,
            userCoords.lon,
            m.lat,
            m.lon
          );
          const bearing = calculateBearingDegrees(
            userCoords.lat,
            userCoords.lon,
            m.lat,
            m.lon
          );
          return {
            ...m,
            nome: `${m.cidade} — ${m.pais_nome_it}`,
            distanceMeters: dist,
            bearing,
            destinationType: (m.tipo === 'embaixada' ? 'embaixada' : 'consulado') as 'consulado' | 'embaixada',
          };
        })
        .sort((a, b) => a.distanceMeters - b.distanceMeters);
    }

    return ANKORA_DATA.missoes_com_coordenada
      .map((m) => {
        const dist = calculateHaversineDistanceMeters(
          userCoords.lat,
          userCoords.lon,
          m.lat,
          m.lon
        );
        const bearing = calculateBearingDegrees(
          userCoords.lat,
          userCoords.lon,
          m.lat,
          m.lon
        );
        return {
          ...m,
          nome: `${m.cidade} — ${m.pais_nome_it}`,
          distanceMeters: dist,
          bearing,
          destinationType: (m.tipo === 'embaixada' ? 'embaixada' : 'consulado') as 'consulado' | 'embaixada',
        };
      })
      .sort((a, b) => a.distanceMeters - b.distanceMeters);
  }, [userCoords, profile.showConsulate, profile.nationality]);

  const displayedWaitingAreas = showAllWaitingAreas
    ? waitingAreas
    : waitingAreas.slice(0, 3);

  return (
    <div className="flex-1 flex flex-col p-4 space-y-4 pb-12" dir={dir}>
      {/* Top Navigation */}
      <div className="flex items-center justify-between">
        <button
          onClick={onBackToHome}
          className="h-10 px-3 -ml-2 rounded-xl flex items-center gap-1.5 text-sm font-semibold text-[#0F2B3D] dark:text-[#E6EDF2] hover:bg-slate-200/60 dark:hover:bg-slate-800 transition active:scale-95"
        >
          <ArrowLeft className="w-5 h-5 rtl-flip" />
          <span>Início</span>
        </button>

        <span className="text-xs text-slate-500 font-medium">
          {userCoords.name || 'Modena'}
        </span>
      </div>

      {/* 1. Fixed Top Card: Call 112 European Emergency Number (Requirement 3 & 10) */}
      <div className="bg-[#FFF4E5] dark:bg-amber-950/30 border-2 border-[#F26A21] rounded-2xl p-4 shadow-sm flex items-center justify-between gap-3">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-xl bg-[#F26A21] text-[#0F2B3D] flex items-center justify-center font-sora text-xl font-bold shrink-0">
            112
          </div>
          <div>
            <h3 className="font-sora text-sm font-bold text-[#0F2B3D] dark:text-amber-100">
              {t.call112Sub}
            </h3>
            <p className="text-xs text-[#B8470B] dark:text-amber-300 font-medium mt-0.5">
              Polícia · Ambulância · Bombeiros
            </p>
          </div>
        </div>
        <a
          href="tel:112"
          className="h-11 px-4 rounded-xl bg-[#F26A21] text-[#0F2B3D] font-sora text-xs font-bold uppercase tracking-wider flex items-center gap-1.5 shrink-0 shadow-xs hover:opacity-95 active:scale-95 transition"
        >
          <PhoneCall className="w-4 h-4 text-[#0F2B3D]" />
          <span>{t.callBtn}</span>
        </a>
      </div>

      {/* Filter Tabs / Segmented Controls */}
      <div className="flex p-1 bg-slate-200/80 dark:bg-slate-800/80 rounded-xl gap-1">
        <button
          onClick={() => setActiveTab('waiting_areas')}
          className={`flex-1 py-2 text-xs font-semibold rounded-lg transition-all flex items-center justify-center gap-1.5 ${
            activeTab === 'waiting_areas'
              ? 'bg-white dark:bg-[#0F2B3D] text-[#0F2B3D] dark:text-white shadow-xs'
              : 'text-[#4A5C6A] dark:text-slate-400 hover:text-slate-900'
          }`}
        >
          <MapPin className="w-3.5 h-3.5 text-[#0E7C74]" />
          <span>{t.tabWaitingAreas}</span>
        </button>

        {profile.showConsulate && profile.nationality !== '__prefer_not__' && (
          <button
            onClick={() => setActiveTab('my_consulate')}
            className={`flex-1 py-2 text-xs font-semibold rounded-lg transition-all flex items-center justify-center gap-1.5 ${
              activeTab === 'my_consulate'
                ? 'bg-white dark:bg-[#0F2B3D] text-[#0F2B3D] dark:text-white shadow-xs'
                : 'text-[#4A5C6A] dark:text-slate-400 hover:text-slate-900'
            }`}
          >
            <Flag className="w-3.5 h-3.5 text-[#F26A21]" />
            <span>{t.tabMyConsulate}</span>
          </button>
        )}

        <button
          onClick={() => setActiveTab('all_embassies')}
          className={`flex-1 py-2 text-xs font-semibold rounded-lg transition-all flex items-center justify-center gap-1.5 ${
            activeTab === 'all_embassies'
              ? 'bg-white dark:bg-[#0F2B3D] text-[#0F2B3D] dark:text-white shadow-xs'
              : 'text-[#4A5C6A] dark:text-slate-400 hover:text-slate-900'
          }`}
        >
          <Building className="w-3.5 h-3.5 text-slate-500" />
          <span>{t.tabOtherEmbassies}</span>
        </button>
      </div>

      {/* TAB 1: Waiting Areas (Proteção Civil) */}
      {activeTab === 'waiting_areas' && (
        <div className="space-y-3">
          <div className="flex items-center justify-between text-xs text-[#4A5C6A] dark:text-slate-400 px-1">
            <span>
              {displayedWaitingAreas.length} de {waitingAreas.length} áreas públicas
            </span>
            <button
              onClick={() => setShowAllWaitingAreas(!showAllWaitingAreas)}
              className="text-[#0E7C74] font-semibold hover:underline"
            >
              {showAllWaitingAreas ? t.showClosest3 : t.showAll}
            </button>
          </div>

          {displayedWaitingAreas.map((area, index) => (
            <div
              key={area.id}
              onClick={() => onSelectDestination(area)}
              className="w-full bg-white dark:bg-[#0E1E28] border border-slate-200 dark:border-slate-800 rounded-2xl p-4 shadow-xs hover:border-[#0E7C74]/50 transition cursor-pointer flex flex-col gap-2 group active:scale-[0.99]"
            >
              <div className="flex items-start justify-between gap-2">
                <div className="flex-1">
                  <div className="flex items-center gap-2">
                    <span className="text-[11px] font-bold text-[#0E7C74] bg-[#0E7C74]/10 px-2 py-0.5 rounded-md">
                      #{index + 1} {t.waitingAreaLabel}
                    </span>
                    <span className="text-[11px] text-slate-400 font-medium">
                      Modena
                    </span>
                  </div>
                  <h4 className="font-sora text-base font-semibold text-[#0F2B3D] dark:text-[#E6EDF2] mt-1 group-hover:text-[#0E7C74] transition-colors leading-snug">
                    {area.nome}
                  </h4>
                  <p className="text-xs text-[#4A5C6A] dark:text-slate-400 mt-0.5">
                    {area.endereco}
                  </p>
                </div>

                {/* Distance & Compass Arrow */}
                <div className="flex flex-col items-end shrink-0 pl-2">
                  <span className="font-sora text-base font-bold text-[#0F2B3D] dark:text-white">
                    {formatLocalizedDistance(area.distanceMeters, lang)}
                  </span>
                  <div className="flex items-center gap-1 text-[11px] text-slate-500 mt-0.5">
                    <Compass
                      className="w-3.5 h-3.5 text-[#F26A21]"
                      style={{ transform: `rotate(${area.bearing}deg)` }}
                    />
                    <span>{Math.round(area.bearing)}°</span>
                  </div>
                </div>
              </div>

              <div className="flex items-center justify-between pt-2 border-t border-slate-100 dark:border-slate-800 text-xs">
                <span className="text-[11px] text-slate-400">
                  Aberta ao público 24h
                </span>
                <span className="text-[#0E7C74] font-semibold flex items-center gap-1">
                  Ver direção & cartão
                  <ArrowRight className="w-3.5 h-3.5 rtl-flip" />
                </span>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* TAB 2: User's Consulate */}
      {activeTab === 'my_consulate' && (
        <div className="space-y-3">
          <div className="text-xs text-[#4A5C6A] dark:text-slate-400 px-1">
            Missões diplomáticas de: <strong className="text-[#0F2B3D] dark:text-white">{profile.nationality}</strong>
          </div>

          {userMissions.length === 0 && !outsideMission && (
            <div className="bg-white dark:bg-[#0E1E28] border border-slate-200 dark:border-slate-800 rounded-2xl p-6 text-center text-xs text-slate-500">
              {t.noMissionsFound}
            </div>
          )}

          {/* If embassy is outside Italy (e.g. Andorra, Monaco, etc.) */}
          {outsideMission && (
            <div className="bg-white dark:bg-[#0E1E28] border border-amber-200 dark:border-amber-900/40 rounded-2xl p-4 shadow-xs space-y-3">
              <div>
                <span className="text-[11px] font-semibold text-[#B45309] bg-[#FFF4E5] dark:bg-amber-950/40 px-2 py-0.5 rounded-md">
                  {outsideMission.observacao}
                </span>
                <h4 className="font-sora text-base font-semibold text-[#0F2B3D] dark:text-[#E6EDF2] mt-1.5">
                  {outsideMission.pais_nome_it}
                </h4>
                <p className="text-xs text-[#4A5C6A] dark:text-slate-400 mt-0.5">
                  {outsideMission.sede_fora_da_italia || 'Sede no exterior'}
                </p>
              </div>

              {outsideMission.telefone_principal && (
                <a
                  href={`tel:${outsideMission.telefone_principal}`}
                  className="w-full h-11 rounded-xl bg-[#0F2B3D] dark:bg-white text-white dark:text-[#0F2B3D] font-sora text-xs font-semibold flex items-center justify-center gap-2 shadow-xs"
                >
                  <Phone className="w-4 h-4 text-[#F26A21]" />
                  <span>{t.callBtn} {outsideMission.telefone_principal}</span>
                </a>
              )}
            </div>
          )}

          {/* Missions with coordinates */}
          {userMissions.map((mission) => (
            <div
              key={mission.id}
              onClick={() => onSelectDestination(mission)}
              className="w-full bg-white dark:bg-[#0E1E28] border border-slate-200 dark:border-slate-800 rounded-2xl p-4 shadow-xs hover:border-[#0E7C74]/50 transition cursor-pointer flex flex-col gap-2 group active:scale-[0.99]"
            >
              <div className="flex items-start justify-between gap-2">
                <div className="flex-1">
                  <div className="flex items-center gap-1.5">
                    <span className="text-[11px] font-semibold text-[#0F2B3D] dark:text-slate-300 bg-slate-100 dark:bg-slate-800 px-2 py-0.5 rounded-md">
                      {mission.tipo === 'embaixada'
                        ? t.embassy
                        : mission.tipo === 'consulado_carreira'
                        ? t.careerConsulate
                        : t.honoraryConsulate}
                    </span>
                    <span className="text-xs font-medium text-slate-500">
                      {mission.cidade}
                    </span>
                  </div>

                  <h4 className="font-sora text-base font-semibold text-[#0F2B3D] dark:text-[#E6EDF2] mt-1 group-hover:text-[#0E7C74] transition-colors leading-snug">
                    {mission.pais_nome_it} ({mission.cidade})
                  </h4>
                  <p className="text-xs text-[#4A5C6A] dark:text-slate-400 mt-0.5">
                    {mission.endereco || 'Endereço em verificação'}
                  </p>
                </div>

                <div className="flex flex-col items-end shrink-0 pl-2">
                  <span className="font-sora text-base font-bold text-[#0F2B3D] dark:text-white">
                    {formatLocalizedDistance(mission.distanceMeters, lang)}
                  </span>
                  <div className="flex items-center gap-1 text-[11px] text-slate-500 mt-0.5">
                    <Compass
                      className="w-3.5 h-3.5 text-[#F26A21]"
                      style={{ transform: `rotate(${mission.bearing}deg)` }}
                    />
                    <span>{Math.round(mission.bearing)}°</span>
                  </div>
                </div>
              </div>

              {/* Status Badges with Icon + Text */}
              <div className="flex flex-wrap items-center gap-2 pt-1">
                {mission.verificacao === 'verificado' && (
                  <span className="inline-flex items-center gap-1 text-[11px] font-medium text-[#0E7C74] bg-[#0E7C74]/10 px-2 py-0.5 rounded-md">
                    <ShieldCheck className="w-3 h-3" />
                    {t.badgeVerified}
                  </span>
                )}
                {mission.verificacao === 'em_verificacao' && (
                  <span className="inline-flex items-center gap-1 text-[11px] font-medium text-[#B45309] bg-[#FFF4E5] dark:bg-amber-950/40 px-2 py-0.5 rounded-md">
                    <AlertCircle className="w-3 h-3 text-[#B45309]" />
                    {t.badgeVerifying}
                  </span>
                )}
                {mission.servico_limitado && (
                  <span className="inline-flex items-center gap-1 text-[11px] font-medium text-[#B45309] bg-[#FFF4E5] dark:bg-amber-950/40 px-2 py-0.5 rounded-md">
                    <AlertCircle className="w-3 h-3 text-[#B45309]" />
                    {t.badgeLimited}
                  </span>
                )}
              </div>

              {/* Action row with call button if present */}
              <div className="flex items-center justify-between pt-2 border-t border-slate-100 dark:border-slate-800 text-xs">
                {mission.telefone_principal ? (
                  <a
                    href={`tel:${mission.telefone_principal}`}
                    onClick={(e) => e.stopPropagation()}
                    className="h-8 px-2.5 rounded-lg bg-slate-100 dark:bg-slate-800 text-[#0F2B3D] dark:text-slate-200 font-semibold flex items-center gap-1.5 hover:bg-slate-200 transition"
                  >
                    <Phone className="w-3.5 h-3.5 text-[#0E7C74]" />
                    <span>{t.callBtn}</span>
                  </a>
                ) : (
                  <span className="text-[11px] text-slate-400">Sem telefone direto</span>
                )}

                <span className="text-[#0E7C74] font-semibold flex items-center gap-1">
                  Ver detalhes
                  <ArrowRight className="w-3.5 h-3.5 rtl-flip" />
                </span>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* TAB 3: All Missions / Other Embassies */}
      {activeTab === 'all_embassies' && (
        <div className="space-y-3">
          <div className="text-xs text-[#4A5C6A] dark:text-slate-400 px-1">
            Consulados e embaixadas em cidades vizinhas (Milão, Bolonha, Roma…)
          </div>

          {otherMissions.slice(0, 10).map((mission) => (
            <div
              key={mission.id}
              onClick={() => onSelectDestination(mission)}
              className="w-full bg-white dark:bg-[#0E1E28] border border-slate-200 dark:border-slate-800 rounded-2xl p-4 shadow-xs hover:border-[#0E7C74]/50 transition cursor-pointer flex flex-col gap-2 group active:scale-[0.99]"
            >
              <div className="flex items-start justify-between gap-2">
                <div className="flex-1">
                  <div className="flex items-center gap-1.5">
                    <span className="text-[11px] font-semibold text-slate-600 dark:text-slate-300 bg-slate-100 dark:bg-slate-800 px-2 py-0.5 rounded-md">
                      {mission.tipo === 'embaixada'
                        ? t.embassy
                        : mission.tipo === 'consulado_carreira'
                        ? t.careerConsulate
                        : t.honoraryConsulate}
                    </span>
                    <span className="text-xs font-medium text-slate-500">
                      {mission.cidade}
                    </span>
                  </div>

                  <h4 className="font-sora text-base font-semibold text-[#0F2B3D] dark:text-[#E6EDF2] mt-1 group-hover:text-[#0E7C74] transition-colors leading-snug">
                    {mission.pais_nome_it} ({mission.cidade})
                  </h4>
                  <p className="text-xs text-[#4A5C6A] dark:text-slate-400 mt-0.5 line-clamp-1">
                    {mission.endereco || 'Endereço registrado'}
                  </p>
                </div>

                <div className="flex flex-col items-end shrink-0 pl-2">
                  <span className="font-sora text-sm font-bold text-[#0F2B3D] dark:text-white">
                    {formatLocalizedDistance(mission.distanceMeters, lang)}
                  </span>
                  <div className="flex items-center gap-1 text-[11px] text-slate-500 mt-0.5">
                    <Compass
                      className="w-3.5 h-3.5 text-[#F26A21]"
                      style={{ transform: `rotate(${mission.bearing}deg)` }}
                    />
                    <span>{Math.round(mission.bearing)}°</span>
                  </div>
                </div>
              </div>

              <div className="flex items-center justify-between pt-2 border-t border-slate-100 dark:border-slate-800 text-xs">
                {mission.telefone_principal ? (
                  <a
                    href={`tel:${mission.telefone_principal}`}
                    onClick={(e) => e.stopPropagation()}
                    className="h-8 px-2.5 rounded-lg bg-slate-100 dark:bg-slate-800 text-[#0F2B3D] dark:text-slate-200 font-semibold flex items-center gap-1.5 hover:bg-slate-200 transition"
                  >
                    <Phone className="w-3.5 h-3.5 text-[#0E7C74]" />
                    <span>{t.callBtn}</span>
                  </a>
                ) : (
                  <span className="text-[11px] text-slate-400">Sem telefone direto</span>
                )}

                <span className="text-[#0E7C74] font-semibold flex items-center gap-1">
                  Ver detalhes
                  <ArrowRight className="w-3.5 h-3.5 rtl-flip" />
                </span>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
