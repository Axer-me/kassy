import type { PulseZone } from '../../types';
import { zoneColors, zoneLabels } from '../../types';
import styles from './PulseIndicator.module.css';

interface PulseIndicatorProps {
  index: number | null;
  zone: PulseZone;
}

const RADIUS = 120;
const SIZE = 280;
const CENTER = SIZE / 2;
const CIRCUMFERENCE = 2 * Math.PI * RADIUS;

export function PulseIndicator({ index, zone }: PulseIndicatorProps) {
  const colors = zoneColors[zone];
  const displayValue = index !== null ? index.toFixed(1) : '—';
  const progress = index !== null ? index / 5 : 0;
  const offset = CIRCUMFERENCE * (1 - progress);

  return (
    <div className={styles.gaugeWrapper}>
      <div className={styles.gauge}>
        <svg className={styles.gauge__svg} viewBox={`0 0 ${SIZE} ${SIZE}`}>
          <circle className={styles.gauge__bg} cx={CENTER} cy={CENTER} r={RADIUS} />
          <circle
            className={styles.gauge__fill}
            cx={CENTER}
            cy={CENTER}
            r={RADIUS}
            stroke={colors.ring}
            strokeDasharray={CIRCUMFERENCE}
            strokeDashoffset={offset}
          />
        </svg>
        <div className={styles.gauge__center}>
          <span className={styles.gauge__value} style={{ color: colors.main }}>
            {displayValue}
          </span>
          <span className={styles.gauge__max}>/ 5</span>
        </div>
      </div>
      <span
        className={styles.gauge__label}
        style={{ background: colors.light, color: colors.main }}
      >
        {zoneLabels[zone]}
      </span>
    </div>
  );
}
