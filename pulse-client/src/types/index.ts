export type PulseStatus = 'Критик' | 'Нейтральный' | 'Лояльный' | 'Нет данных';

export type PulseZone = 'critical' | 'neutral' | 'loyal' | 'unknown';

export interface ClaimInfo {
  theme: string;
  status: 'Открыта' | 'Закрыта';
  reason: string;
  resolution: string;
  compensation?: string;
  closedDate?: string;
}

export interface VocBlock {
  category: 'продукт' | 'канал' | 'сервис';
  name: string;
  score: number;
  comment?: string;
}

export interface ClientPulse {
  pin: string;
  companyName: string;
  inn: string;
  pulseIndex: number | null;
  status: PulseStatus;
  zone: PulseZone;
  briefAssessment: string;
  positiveSides: string;
  negativeSides: string;
  claimSummary: string;
  claimDetails?: ClaimInfo;
  recommendation: string;
  tenureYears: number;
  tenureMonths: number;
  tenureDays: number;
  vocScores: VocBlock[];
  suggestedProducts: string[];
  loyaltyTips: string[];
}

export function getZoneFromStatus(status: PulseStatus, index: number | null): PulseZone {
  if (status === 'Нет данных' || index === null) return 'unknown';
  if (status === 'Критик' || index <= 3) return 'critical';
  if (status === 'Лояльный' || index >= 5) return 'loyal';
  return 'neutral';
}

export const zoneLabels: Record<PulseZone, string> = {
  critical: 'Клиент критик',
  neutral: 'Клиент нейтральный',
  loyal: 'Клиент лояльный',
  unknown: 'Недостаточно данных',
};

export const zoneColors: Record<PulseZone, { main: string; light: string; ring: string }> = {
  critical: { main: '#EF3124', light: '#FDE8E6', ring: '#EF3124' },
  neutral: { main: '#F6A623', light: '#FFF8E6', ring: '#F6A623' },
  loyal: { main: '#2FC26E', light: '#E8F9EF', ring: '#2FC26E' },
  unknown: { main: '#9CA3AF', light: '#F3F4F6', ring: '#D1D5DB' },
};
