import { useNavigate } from 'react-router-dom';
import { isSfaTheme } from '../config/theme';
import { ClientSearchView } from '../components/ClientSearchView/ClientSearchView';
import { ClientSidebar } from '../components/ClientSidebar/ClientSidebar';
import { clients } from '../data/clients';
import { zoneColors } from '../types';
import styles from './pages.module.css';

export function ClientListPage() {
  const navigate = useNavigate();
  const sfa = isSfaTheme();

  const stats = {
    total: clients.length,
    critical: clients.filter((c) => c.zone === 'critical').length,
    neutral: clients.filter((c) => c.zone === 'neutral').length,
    loyal: clients.filter((c) => c.zone === 'loyal').length,
  };

  const firstClient = clients[0];

  if (sfa) {
    return <ClientSearchView />;
  }

  return (
    <div className={styles.page}>
      <ClientSidebar />
      <div className={styles.content}>
        <div className={styles.stats}>
          <StatCard label="Всего клиентов" value={stats.total} />
          <StatCard label="Критики" value={stats.critical} color={zoneColors.critical.main} />
          <StatCard label="Нейтральные" value={stats.neutral} color={zoneColors.neutral.main} />
          <StatCard label="Лояльные" value={stats.loyal} color={zoneColors.loyal.main} />
        </div>
        <div className={styles.welcome}>
          <h2 className={styles.welcome__title}>Карточка готовности к разговору</h2>
          <p className={styles.welcome__text}>
            Сервис «Пульс клиента» помогает клиентскому менеджеру быстро оценить настроение
            клиента перед звонком или встречей.
          </p>
          {firstClient && (
            <div className={styles.welcome__hint}>
              Начните с{' '}
              <button type="button" className={styles.linkBtn} onClick={() => navigate(`/client/${firstClient.pin}`)}>
                {firstClient.pin}
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

function StatCard({ label, value, color }: { label: string; value: number; color?: string }) {
  return (
    <div className={styles.stat}>
      <div className={styles.stat__value} style={color ? { color } : undefined}>{value}</div>
      <div className={styles.stat__label}>{label}</div>
    </div>
  );
}
