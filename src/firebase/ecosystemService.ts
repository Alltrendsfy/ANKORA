import {
  collection,
  doc,
  getDoc,
  getDocs,
  setDoc,
  addDoc,
  query,
  where,
  orderBy,
  limit,
  onSnapshot,
} from 'firebase/firestore';
import { db, auth, ensureAuthUser } from './config';
import { ANKORA_DATA } from '../data/ankoraData';

export interface EcosystemEmergencyReport {
  id: string;
  areaId: string;
  areaName: string;
  status: 'open_clear' | 'crowded' | 'first_aid_present' | 'blocked_access';
  note?: string;
  createdAt: string;
  authorUid: string;
}

export interface EcosystemStatusInfo {
  reportsCount: number;
  latestReport?: EcosystemEmergencyReport;
}

/**
 * Publishes or checks official package in Firestore so other ecosystem tools can query it.
 */
export async function syncOfficialPackage(): Promise<void> {
  try {
    const pkgRef = doc(db, 'official_packages', 'IT-MO');
    const snap = await getDoc(pkgRef);
    if (!snap.exists()) {
      await setDoc(pkgRef, {
        packageId: ANKORA_DATA.pacote,
        version: ANKORA_DATA.versao_dados,
        country: ANKORA_DATA.pais,
        city: ANKORA_DATA.cidade_piloto,
        emergencyNumber: ANKORA_DATA.numero_emergencia,
        updatedAt: new Date().toISOString(),
      });
    }
  } catch (e) {
    // Fails silently in offline mode
    console.warn('Ecosystem package sync note:', e);
  }
}

/**
 * Listens to recent emergency reports for a specific area or all areas
 */
export function subscribeAreaReports(
  areaId: string | null,
  callback: (reports: EcosystemEmergencyReport[]) => void
): () => void {
  try {
    const reportsCol = collection(db, 'emergency_reports');
    const q = areaId
      ? query(reportsCol, where('areaId', '==', areaId), limit(10))
      : query(reportsCol, limit(20));

    return onSnapshot(
      q,
      (snapshot) => {
        const list: EcosystemEmergencyReport[] = [];
        snapshot.forEach((docSnap) => {
          list.push(docSnap.data() as EcosystemEmergencyReport);
        });
        // Sort descending by createdAt
        list.sort((a, b) => (b.createdAt || '').localeCompare(a.createdAt || ''));
        callback(list);
      },
      (err) => {
        console.warn('Reports snapshot note (offline fallback in use):', err);
        callback([]);
      }
    );
  } catch (e) {
    console.warn('Subscription error:', e);
    callback([]);
    return () => {};
  }
}

/**
 * Submit an emergency field report for a waiting area
 */
export async function submitEmergencyReport(params: {
  areaId: string;
  areaName: string;
  status: 'open_clear' | 'crowded' | 'first_aid_present' | 'blocked_access';
  note?: string;
}): Promise<boolean> {
  try {
    const user = await ensureAuthUser();
    if (!user) {
      throw new Error('Não foi possível autenticar a sessão');
    }

    const reportId = `rep_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`;
    const reportDoc = doc(db, 'emergency_reports', reportId);

    const payload: EcosystemEmergencyReport = {
      id: reportId,
      areaId: params.areaId,
      areaName: params.areaName,
      status: params.status,
      note: params.note ? params.note.slice(0, 500) : '',
      createdAt: new Date().toISOString(),
      authorUid: user.uid,
    };

    await setDoc(reportDoc, payload);
    return true;
  } catch (e) {
    console.error('Failed to submit emergency report:', e);
    return false;
  }
}
