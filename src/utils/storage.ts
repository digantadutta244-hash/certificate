import { CertificateData } from '../types/certificate';

const STORAGE_KEY = 'pm_surya_ghar_ss_certificates_v1';
const COUNTER_KEY = 'pm_surya_ghar_ss_cert_counter_v1';

export function getSavedCertificates(): CertificateData[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? parsed : [];
  } catch (err) {
    console.error('Failed to read certificates from LocalStorage:', err);
    return [];
  }
}

export function saveCertificateToStorage(cert: CertificateData): {
  success: boolean;
  error?: string;
  certificates: CertificateData[];
} {
  try {
    const existing = getSavedCertificates();
    const index = existing.findIndex((item) => item.id === cert.id);
    const updatedCert: CertificateData = {
      ...cert,
      updatedAt: new Date().toISOString(),
    };

    let updatedList: CertificateData[];
    if (index >= 0) {
      updatedList = [...existing];
      updatedList[index] = updatedCert;
    } else {
      updatedList = [updatedCert, ...existing];
    }

    localStorage.setItem(STORAGE_KEY, JSON.stringify(updatedList));
    syncCounterWithCertificateNo(cert.certificateNo);

    return { success: true, certificates: updatedList };
  } catch (err) {
    console.error('Failed to save certificate to LocalStorage:', err);
    return {
      success: false,
      error:
        'Browser LocalStorage is full. Please delete old certificates or reduce photo sizes.',
      certificates: getSavedCertificates(),
    };
  }
}

export function deleteCertificateFromStorage(id: string): CertificateData[] {
  try {
    const existing = getSavedCertificates();
    const filtered = existing.filter((item) => item.id !== id);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(filtered));
    return filtered;
  } catch (err) {
    console.error('Failed to delete certificate:', err);
    return getSavedCertificates();
  }
}

function syncCounterWithCertificateNo(certNo: string): void {
  const match = certNo.match(/SS\/PC\/(\d{4})\/(\d+)/i);
  if (!match) return;
  const num = parseInt(match[2], 10);
  if (isNaN(num)) return;

  try {
    const currentMax = parseInt(localStorage.getItem(COUNTER_KEY) || '0', 10);
    if (num > currentMax) {
      localStorage.setItem(COUNTER_KEY, String(num));
    }
  } catch {
    // ignore storage errors
  }
}

export function generateNextCertificateNumber(yearOverride?: number): string {
  const year = yearOverride || new Date().getFullYear() || 2026;
  const existing = getSavedCertificates();
  let maxNumber = 0;

  try {
    const storedCounter = parseInt(localStorage.getItem(COUNTER_KEY) || '0', 10);
    if (!isNaN(storedCounter) && storedCounter > maxNumber) {
      maxNumber = storedCounter;
    }
  } catch {
    // ignore
  }

  for (const cert of existing) {
    const match = cert.certificateNo.match(/SS\/PC\/(\d{4})\/(\d+)/i);
    if (match) {
      const num = parseInt(match[2], 10);
      if (!isNaN(num) && num > maxNumber) {
        maxNumber = num;
      }
    }
  }

  const nextNum = maxNumber + 1;
  const padded = String(nextNum).padStart(3, '0');
  return `SS/PC/${year}/${padded}`;
}

export function createBlankCertificate(autoCertNo?: string): CertificateData {
  const today = new Date().toISOString().split('T')[0];
  return {
    id:
      typeof crypto !== 'undefined' && crypto.randomUUID
        ? crypto.randomUUID()
        : `cert_${Date.now()}_${Math.random().toString(36).slice(2, 8)}`,
    certificateNo: autoCertNo ?? generateNextCertificateNumber(2026),
    consumerName: '',
    consumerNumber: '',
    applicationNumber: '',
    address: '',
    plantCapacity: '',
    subDivision: '',
    vendorName: 'M/S S.S ENTERPRISE',
    completionDate: today,
    place: 'Darrang (Assam)',
    otherDetails: '',
    photos: {
      projectComplete: null,
      solarPanel: null,
      earthing: null,
      lightningArrester: null,
      otherAccessories: null,
    },
    hideEmptyPhotos: false,
    photoFitMode: 'cover',
    designStyle: 'sovereign',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  };
}
