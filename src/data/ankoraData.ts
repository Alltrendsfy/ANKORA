import rawData from '../../public/assets/aistudio/ankora_pacote_IT-MO_demo_74652b41.json';

export interface EmergencyArea {
  id: string;
  tipo: 'area_espera' | 'acolhimento_coberto' | 'acolhimento_ar_livre' | 'concentracao_socorro';
  nome: string;
  endereco: string;
  lat: number;
  lon: number;
  para_publico: boolean;
  fonte: string;
}

export interface Mission {
  id: string;
  tipo: 'consulado_carreira' | 'consulado_honorario' | 'embaixada';
  pais_iso: string;
  pais_nome_it: string;
  cidade: string;
  endereco: string | null;
  lat: number;
  lon: number;
  verificacao: 'verificado' | 'em_verificacao';
  servico_limitado: boolean;
  fonte: string;
  telefones: string[];
  telefone_principal: string | null;
}

export interface MissionOutside {
  pais_nome_it: string;
  sede_fora_da_italia: string | null;
  observacao: string;
  telefones: string[];
  telefone_principal: string | null;
}

export interface AnkoraPackage {
  pacote: string;
  versao_dados: string;
  pais: string;
  cidade_piloto: string;
  numero_emergencia: string;
  aviso_demo: string;
  atribuicao: string[];
  areas_emergencia_modena: EmergencyArea[];
  missoes_com_coordenada: Mission[];
  embaixadas_fora_da_italia: MissionOutside[];
}

export const ANKORA_DATA: AnkoraPackage = rawData as AnkoraPackage;

// IndexedDB database and store names
const DB_NAME = 'ankora_db';
const DB_VERSION = 1;
const STORE_NAME = 'package_cache';
const CACHE_KEY = 'IT-MO_data';

export async function initIndexedDB(): Promise<IDBDatabase> {
  return new Promise((resolve, reject) => {
    if (typeof window === 'undefined' || !window.indexedDB) {
      reject(new Error('IndexedDB not supported'));
      return;
    }
    const request = window.indexedDB.open(DB_NAME, DB_VERSION);
    request.onupgradeneeded = () => {
      const db = request.result;
      if (!db.objectStoreNames.contains(STORE_NAME)) {
        db.createObjectStore(STORE_NAME);
      }
    };
    request.onsuccess = () => resolve(request.result);
    request.onerror = () => reject(request.error);
  });
}

export async function saveToIndexedDB(data: AnkoraPackage): Promise<void> {
  try {
    const db = await initIndexedDB();
    const tx = db.transaction(STORE_NAME, 'readwrite');
    const store = tx.objectStore(STORE_NAME);
    store.put(data, CACHE_KEY);
    return new Promise((resolve) => {
      tx.oncomplete = () => resolve();
      tx.onerror = () => resolve();
    });
  } catch (e) {
    console.warn('Could not save to IndexedDB:', e);
  }
}

export async function loadFromIndexedDB(): Promise<AnkoraPackage | null> {
  try {
    const db = await initIndexedDB();
    const tx = db.transaction(STORE_NAME, 'readonly');
    const store = tx.objectStore(STORE_NAME);
    const req = store.get(CACHE_KEY);
    return new Promise((resolve) => {
      req.onsuccess = () => resolve(req.result || null);
      req.onerror = () => resolve(null);
    });
  } catch {
    return null;
  }
}

/**
 * Calculates great-circle distance between two points on a sphere (Haversine formula).
 * Returns distance in meters.
 */
export function calculateHaversineDistanceMeters(
  lat1: number,
  lon1: number,
  lat2: number,
  lon2: number
): number {
  const R = 6371000; // Earth's mean radius in meters
  const dLat = ((lat2 - lat1) * Math.PI) / 180;
  const dLon = ((lon2 - lon1) * Math.PI) / 180;
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos((lat1 * Math.PI) / 180) *
      Math.cos((lat2 * Math.PI) / 180) *
      Math.sin(dLon / 2) *
      Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return R * c;
}

/**
 * Calculates bearing from origin (lat1, lon1) to destination (lat2, lon2) in degrees (0 - 360).
 */
export function calculateBearingDegrees(
  lat1: number,
  lon1: number,
  lat2: number,
  lon2: number
): number {
  const φ1 = (lat1 * Math.PI) / 180;
  const φ2 = (lat2 * Math.PI) / 180;
  const Δλ = ((lon2 - lon1) * Math.PI) / 180;

  const y = Math.sin(Δλ) * Math.cos(φ2);
  const x =
    Math.cos(φ1) * Math.sin(φ2) -
    Math.sin(φ1) * Math.cos(φ2) * Math.cos(Δλ);
  const θ = Math.atan2(y, x);
  return ((θ * 180) / Math.PI + 360) % 360;
}

/**
 * Maps bearing to 8 cardinal directions.
 */
export function getCardinalDirectionKey(bearing: number): 'north' | 'northeast' | 'east' | 'southeast' | 'south' | 'southwest' | 'west' | 'northwest' {
  const directions: Array<'north' | 'northeast' | 'east' | 'southeast' | 'south' | 'southwest' | 'west' | 'northwest'> = [
    'north',
    'northeast',
    'east',
    'southeast',
    'south',
    'southwest',
    'west',
    'northwest',
  ];
  const index = Math.round(bearing / 45) % 8;
  return directions[index];
}

/**
 * Formats distance with localized units:
 * e.g. "580 m" or "12,4 km"
 */
export function formatLocalizedDistance(meters: number, locale: string = 'pt-BR'): string {
  if (meters < 1000) {
    const rounded = Math.round(meters);
    const nf = new Intl.NumberFormat(locale, { maximumFractionDigits: 0 });
    return `${nf.format(rounded)} m`;
  }
  const km = meters / 1000;
  const nf = new Intl.NumberFormat(locale, {
    minimumFractionDigits: 1,
    maximumFractionDigits: 1,
  });
  return `${nf.format(km)} km`;
}

/**
 * Get unique list of countries from dataset
 */
export function getAvailableCountries(): { iso?: string; nameIt: string }[] {
  const map = new Map<string, { iso?: string; nameIt: string }>();
  
  ANKORA_DATA.missoes_com_coordenada.forEach((m) => {
    if (!map.has(m.pais_nome_it)) {
      map.set(m.pais_nome_it, { iso: m.pais_iso, nameIt: m.pais_nome_it });
    }
  });

  ANKORA_DATA.embaixadas_fora_da_italia.forEach((m) => {
    if (!map.has(m.pais_nome_it)) {
      map.set(m.pais_nome_it, { nameIt: m.pais_nome_it });
    }
  });

  return Array.from(map.values()).sort((a, b) => a.nameIt.localeCompare(b.nameIt));
}
