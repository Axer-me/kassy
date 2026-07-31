import type { ClientPulse } from '../../types';
import { zoneColors } from '../../types';

export type StatusBadgeTone = 'green' | 'red' | 'yellow' | 'grey' | 'pulse';

export interface ClientStatusBadge {
  id: string;
  label: string;
  value?: string | number;
  tone: StatusBadgeTone;
  icon: string;
  pulseColor?: string;
  clickable?: boolean;
}

function hasClaim(client: ClientPulse): boolean {
  const s = client.claimSummary.toLowerCase();
  return !s.includes('нет') && !s.includes('не зафиксирован') && !s.includes('не поступало');
}

export function getClientStatusBadges(client: ClientPulse): ClientStatusBadge[] {
  const claimCount = hasClaim(client) ? 1 : 0;
  const offerCount = client.suggestedProducts.length;
  const pulseValue =
    client.pulseIndex !== null ? client.pulseIndex.toFixed(1).replace('.', ',') : '—';

  return [
    {
      id: 'offers',
      label: 'Предложения',
      value: offerCount || undefined,
      tone: 'green',
      icon: '📄',
    },
    {
      id: 'claims',
      label: 'Претензии',
      value: claimCount || undefined,
      tone: claimCount > 0 ? 'red' : 'grey',
      icon: '!',
    },
    { id: 'payroll', label: 'ЗП клиент', tone: 'green', icon: '💳' },
    { id: 'bdk', label: 'Есть в БДК', tone: 'green', icon: '⊕' },
    { id: 'client', label: 'Клиент', tone: 'green', icon: '♥' },
    { id: 'ved', label: 'ВЭД (не склонен)', tone: 'green', icon: '🌐' },
    { id: 'debt', label: 'Задолженность', tone: 'grey', icon: '⏱' },
    {
      id: 'pulse',
      label: 'Пульс клиента',
      value: pulseValue,
      tone: 'pulse',
      icon: '◉',
      pulseColor: zoneColors[client.zone].main,
      clickable: true,
    },
  ];
}
