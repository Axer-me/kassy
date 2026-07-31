import { useEffect, useState } from 'react';
import type { ClientPulse } from '../../types';
import { clientTitle, maskInn } from '../../utils/clientDisplay';
import { getClientStatusBadges } from './statusBadges';
import styles from './SfaClientChrome.module.css';

export type SfaTab = 'Пульс клиента';

interface SfaClientChromeProps {
  client: ClientPulse;
}

function formatTime(date: Date): string {
  return date.toLocaleTimeString('ru-RU', { hour: '2-digit', minute: '2-digit' });
}

export function SfaClientChrome({ client }: SfaClientChromeProps) {
  const statusBadges = getClientStatusBadges(client);
  const [time, setTime] = useState(() => formatTime(new Date()));

  useEffect(() => {
    const id = window.setInterval(() => setTime(formatTime(new Date())), 30_000);
    return () => window.clearInterval(id);
  }, []);

  return (
    <header className={styles.chrome}>
      <div className={styles.headerRow}>
        <div className={styles.headerMain}>
          <h1 className={styles.companyName}>{clientTitle(client)}</h1>
          <div className={styles.meta}>
            <span>Город: Москва</span>
            <span>ИНН: {maskInn(client.inn)}</span>
            <span>PIN: {client.pin}</span>
          </div>
          <div className={styles.indicators}>
            <span className={styles.indicator}>
              <span className={`${styles.indicator__dot} ${styles.indicator__dotGreen}`}>0</span>
              Комплаенс
            </span>
            <span className={styles.indicator}>
              <span className={`${styles.indicator__dot} ${styles.indicator__dotOrange}`} />
              Индикатор риска
            </span>
          </div>
        </div>
        <div className={styles.headerTools}>
          <span className={styles.headerTime}>{time}</span>
          <button type="button" className={styles.headerRefresh} title="Обновить" aria-label="Обновить">
            ↻
          </button>
          <button type="button" className={styles.actionsBtn}>
            Действия ▾
          </button>
        </div>
      </div>

      <div className={styles.statusRow} role="toolbar" aria-label="Статусы клиента">
        {statusBadges.map((badge) => {
          const isPulse = badge.id === 'pulse';

          const toneClass =
            badge.tone === 'green'
              ? styles.statusBadge_green
              : badge.tone === 'red'
                ? styles.statusBadge_red
                : badge.tone === 'pulse'
                  ? styles.statusBadge_pulse
                  : styles.statusBadge_grey;

          if (isPulse) {
            return (
              <span
                key={badge.id}
                className={`${styles.statusBadge} ${toneClass} ${styles.statusBadge_active}`}
                title={`${badge.label}: ${badge.value}`}
              >
                <span
                  className={styles.statusBadge__mark}
                  style={{ background: badge.pulseColor }}
                >
                  {badge.value}
                </span>
                <span className={styles.statusBadge__icon}>{badge.icon}</span>
                {badge.label}
              </span>
            );
          }

          return (
            <span key={badge.id} className={`${styles.statusBadge} ${toneClass}`}>
              {badge.value !== undefined && (
                <span className={styles.statusBadge__mark}>{badge.value}</span>
              )}
              <span className={styles.statusBadge__icon}>{badge.icon}</span>
              {badge.label}
            </span>
          );
        })}
      </div>

      <div className={styles.tabs} role="tablist" aria-label="Разделы карточки">
        <span className={`${styles.tab} ${styles.tabActive}`} role="tab" aria-selected>
          Пульс клиента
        </span>
      </div>
    </header>
  );
}
