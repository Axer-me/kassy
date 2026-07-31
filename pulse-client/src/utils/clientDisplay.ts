import type { ClientPulse } from '../types';

export const MASKED_INN = 'XXXXXXXXXX';

export function maskInn(_inn?: string): string {
  return MASKED_INN;
}

export function clientTitle(client: ClientPulse): string {
  return client.pin;
}

export function formatBankTenure(_client?: ClientPulse): string {
  return 'Клиент работает с Альфа-Банком X лет, X месяцев';
}
