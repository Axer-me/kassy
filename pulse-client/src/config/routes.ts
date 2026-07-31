import { getClientByPin, searchClients } from '../data/clients';

export const CLIENTS_LIST_PATH = '/clients';

/** Клиент при открытии приложения / демо HTML */
export const DEFAULT_CLIENT_PIN = 'U64570';

export function getDefaultClientPin(): string {
  return getClientByPin(DEFAULT_CLIENT_PIN)?.pin ?? searchClients('')[0]?.pin ?? '';
}

export function defaultClientPath(): string {
  const pin = getDefaultClientPin();
  return pin ? `/client/${pin}` : CLIENTS_LIST_PATH;
}
