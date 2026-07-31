import type { ClientPulse } from '../../types';
import { isSfaTheme } from '../../config/theme';
import { clientTitle, formatBankTenure, maskInn } from '../../utils/clientDisplay';
import { PulseIndicator } from '../PulseIndicator/PulseIndicator';
import { PulseTrafficLight } from '../PulseIndicator/PulseTrafficLight';
import styles from './PulseWidget.module.css';

interface PulseWidgetProps {
  client: ClientPulse;
  /** embedded — без шапки (используется внутри SfaClientChrome) */
  variant?: 'standalone' | 'embedded';
}

function getScoreClass(score: number): string {
  if (score >= 4.5) return styles.scoreHigh;
  if (score >= 3) return styles.scoreMid;
  return styles.scoreLow;
}

export function PulseWidget({ client, variant }: PulseWidgetProps) {
  const { claimDetails } = client;
  const hasClaim = !client.claimSummary.toLowerCase().includes('нет');
  const embedded = variant === 'embedded' || (variant === undefined && isSfaTheme());
  const widgetClass = embedded ? `${styles.widget} ${styles.widgetEmbedded}` : styles.widget;

  return (
    <div className={widgetClass}>
      {!embedded && (
        <header className={styles.widget__header}>
          <div className={styles.widget__headerInfo}>
            <div className={styles.widget__badge}>
              <span className={styles.widget__badgeDot} />
              Пульс клиента
            </div>
            <h1 className={styles.widget__title}>{clientTitle(client)}</h1>
            <div className={styles.widget__meta}>
              <span className={styles.widget__metaItem}>
                <span className={styles.widget__metaLabel}>PIN:</span>
                {client.pin}
              </span>
              <span className={styles.widget__metaItem}>
                <span className={styles.widget__metaLabel}>ИНН:</span>
                {maskInn(client.inn)}
              </span>
            </div>
            <div className={styles.tenure}>{formatBankTenure(client)}</div>
          </div>
          <PulseIndicator index={client.pulseIndex} zone={client.zone} />
        </header>
      )}

      <div className={embedded ? styles.summary : styles.interpretation}>
        <div className={styles.summary__main}>
          <div className={styles.interpretation__label}>Интерпретация индекса</div>
          <p className={styles.interpretation__text}>{client.briefAssessment}</p>
          {embedded && (
            <p className={styles.summary__tenure}>{formatBankTenure(client)}</p>
          )}
        </div>
        {embedded && (
          <aside className={styles.summary__gauge}>
            <PulseTrafficLight index={client.pulseIndex} zone={client.zone} />
          </aside>
        )}
      </div>

      <div className={styles.grid}>
        <section>
          <h3 className={styles.section__title}>
            <span className={`${styles.section__icon} ${styles.iconPositive}`}>+</span>
            Положительные стороны (VoC)
          </h3>
          <p className={styles.section__text}>{client.positiveSides}</p>
          {client.vocScores.filter((v) => v.score >= 4).length > 0 && (
            <div className={styles.vocScores}>
              {client.vocScores
                .filter((v) => v.score >= 4)
                .map((v) => (
                  <div key={v.name} className={styles.vocScore}>
                    <span>
                      {v.name}{' '}
                      <span style={{ color: 'var(--alfa-gray-500)' }}>({v.category})</span>
                    </span>
                    <span className={`${styles.vocScore__value} ${getScoreClass(v.score)}`}>
                      {v.score}
                    </span>
                  </div>
                ))}
            </div>
          )}
        </section>

        <section>
          <h3 className={styles.section__title}>
            <span className={`${styles.section__icon} ${styles.iconNegative}`}>−</span>
            Негативные стороны (VoC)
          </h3>
          <p className={styles.section__text}>{client.negativeSides}</p>
          {client.vocScores.filter((v) => v.score < 4).length > 0 && (
            <div className={styles.vocScores}>
              {client.vocScores
                .filter((v) => v.score < 4)
                .map((v) => (
                  <div key={v.name} className={styles.vocScore}>
                    <span>
                      {v.name}{' '}
                      <span style={{ color: 'var(--alfa-gray-500)' }}>({v.category})</span>
                    </span>
                    <span className={`${styles.vocScore__value} ${getScoreClass(v.score)}`}>
                      {v.score}
                    </span>
                  </div>
                ))}
            </div>
          )}
        </section>

        <section>
          <h3 className={styles.section__title}>
            <span className={`${styles.section__icon} ${styles.iconClaim}`}>!</span>
            Претензии (ClaimCRM)
          </h3>
          <p className={styles.section__text}>{client.claimSummary}</p>
          {claimDetails && (
            <div className={styles.claimCard}>
              <div className={styles.claimCard__row}>
                <span className={styles.claimCard__label}>Тема</span>
                <span>{claimDetails.theme}</span>
              </div>
              <div className={styles.claimCard__row}>
                <span className={styles.claimCard__label}>Статус</span>
                <span
                  className={`${styles.claimStatus} ${
                    claimDetails.status === 'Открыта'
                      ? styles.claimStatusOpen
                      : styles.claimStatusClosed
                  }`}
                >
                  {claimDetails.status}
                </span>
              </div>
              <div className={styles.claimCard__row}>
                <span className={styles.claimCard__label}>Причина</span>
                <span>{claimDetails.reason}</span>
              </div>
              <div className={styles.claimCard__row}>
                <span className={styles.claimCard__label}>Решение</span>
                <span>{claimDetails.resolution}</span>
              </div>
              {claimDetails.compensation && (
                <div className={styles.claimCard__row}>
                  <span className={styles.claimCard__label}>Возмещение</span>
                  <span>{claimDetails.compensation}</span>
                </div>
              )}
              {hasClaim && claimDetails.status === 'Закрыта' && (
                <div className={styles.claimCard__row} style={{ marginTop: 8, fontWeight: 600 }}>
                  <span className={styles.claimCard__label} />
                  <span style={{ color: 'var(--alfa-red)' }}>
                    Убедись, что претензия закрыта
                  </span>
                </div>
              )}
            </div>
          )}
        </section>

        <section className={styles.aiBlock}>
          <h3 className={styles.section__title}>
            <span className={`${styles.section__icon} ${styles.iconAi}`}>AI</span>
            Рекомендация для КМ
          </h3>
          <div className={styles.aiRecommendation}>{client.recommendation}</div>
        </section>
      </div>

      <div className={styles.loyalty}>
        <h3 className={styles.loyalty__title}>
          {client.zone === 'loyal'
            ? 'Клиент достаточно лояльный — рекомендуется:'
            : client.zone === 'unknown'
              ? 'Недостаточно данных — рекомендуется:'
              : 'Для повышения лояльности рекомендуется:'}
        </h3>
        <ul className={styles.loyalty__list}>
          {client.loyaltyTips.map((tip) => (
            <li key={tip} className={styles.loyalty__item}>
              <span className={styles.loyalty__bullet} />
              {tip}
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
