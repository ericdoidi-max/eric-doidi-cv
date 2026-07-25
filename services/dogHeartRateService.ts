import { DogHeartRateReading, DogSize } from '../types';

const STORAGE_KEY = 'dogHeartRate.readings.v1';

export const RATIO_BY_SIZE: Record<DogSize, number> = {
  small: 5.5,
  medium: 4.5,
  large: 4,
};

export const SIZE_LABEL: Record<DogSize, string> = {
  small: 'Petit (< 10 kg)',
  medium: 'Moyen (10-25 kg)',
  large: 'Grand (> 25 kg)',
};

const getSheetWebhookUrl = (): string | undefined => {
  try {
    // @ts-ignore - import.meta is Vite-specific
    return import.meta.env?.VITE_DOG_SHEET_WEBHOOK_URL || undefined;
  } catch {
    return undefined;
  }
};

export const loadReadings = (): DogHeartRateReading[] => {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
};

export const saveReadings = (readings: DogHeartRateReading[]): void => {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(readings));
};

export const isSheetSyncConfigured = (): boolean => !!getSheetWebhookUrl();

// Sends the reading to the Google Sheet via the Apps Script Web App webhook.
// Uses a text/plain content type on purpose: it keeps the request a "simple"
// CORS request so the browser skips the preflight OPTIONS call that Apps
// Script Web Apps don't handle.
export const syncReadingToSheet = async (reading: DogHeartRateReading): Promise<{ ok: boolean; error?: string }> => {
  const url = getSheetWebhookUrl();
  if (!url) return { ok: false, error: 'Synchronisation non configurée (VITE_DOG_SHEET_WEBHOOK_URL manquant).' };

  try {
    await fetch(url, {
      method: 'POST',
      mode: 'no-cors',
      headers: { 'Content-Type': 'text/plain;charset=utf-8' },
      body: JSON.stringify(reading),
    });
    // 'no-cors' mode makes the response opaque, so we can't read status/body.
    // Absence of a thrown network error is the best signal we get here.
    return { ok: true };
  } catch (error: any) {
    return { ok: false, error: error?.message || 'Échec réseau lors de la synchronisation.' };
  }
};
