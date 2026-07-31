import type { ClientPulse } from '../../types';
import { zoneColors, zoneLabels } from '../../types';
import styles from './PulseBadge.module.css';

interface PulseBadgeProps {
  client: ClientPulse;
}

export function PulseBadge({ client }: PulseBadgeProps) {
  const colors = zoneColors[client.zone];
  const displayValue =
    client.pulseIndex !== null ? client.pulseIndex.toFixed(2).replace('.', ',') : '—';

  return (
    <div className={styles.badge}>
      <span className={styles.badge__label}>Пульс клиента</span>
      <div className={styles.badge__circle} style={{ background: colors.main }}>
        {displayValue}
      </div>
      <div className={styles.popover}>
        <div className={styles.popover__score}>
          <span className={styles.popover__dot} style={{ background: colors.main }} />
          <span className={styles.popover__value}>{displayValue}</span>
        </div>
        <div className={styles.popover__status} style={{ color: colors.main }}>
          {zoneLabels[client.zone]}
        </div>
        <p className={styles.popover__text}>{client.briefAssessment}</p>
      </div>
    </div>
  );
}
