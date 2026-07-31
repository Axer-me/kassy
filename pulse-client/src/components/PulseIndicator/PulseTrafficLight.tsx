import type { PulseZone } from '../../types';
import { zoneColors, zoneLabels } from '../../types';
import styles from './PulseTrafficLight.module.css';

interface PulseTrafficLightProps {
  index: number | null;
  zone: PulseZone;
  size?: 'compact' | 'large';
}

export function PulseTrafficLight({ index, zone, size = 'compact' }: PulseTrafficLightProps) {
  const colors = zoneColors[zone];
  const displayValue =
    index !== null ? index.toFixed(1).replace('.', ',') : '—';

  return (
    <div
      className={`${styles.wrap} ${size === 'large' ? styles.wrap_large : styles.wrap_compact}`}
    >
      <div
        className={`${styles.light} ${size === 'large' ? styles.light_large : styles.light_compact}`}
        style={{
          background: colors.main,
          boxShadow: `0 4px 16px ${colors.main}40`,
        }}
        aria-label={`Пульс клиента: ${displayValue}, ${zoneLabels[zone]}`}
      >
        <span className={styles.light__value}>{displayValue}</span>
        <span className={styles.light__scale}>/ 5</span>
      </div>
      <span
        className={styles.light__label}
        style={{ background: colors.light, color: colors.main }}
      >
        {zoneLabels[zone]}
      </span>
    </div>
  );
}
