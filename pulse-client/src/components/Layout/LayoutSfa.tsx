import { useEffect } from 'react';
import { Outlet, useLocation, useNavigate, useParams } from 'react-router-dom';
import { CLIENTS_LIST_PATH } from '../../config/routes';
import { getClientByPin } from '../../data/clients';
import { SearchProvider, useSearch } from '../../context/SearchContext';
import { SfaWorkspaceTabs } from '../SfaWorkspaceTabs/SfaWorkspaceTabs';
import { SfaNavIcon, type SfaNavIconId } from './SfaNavIcons';
import styles from './LayoutSfa.module.css';

interface NavItem {
  icon: SfaNavIconId;
  label: string;
  path: string | null;
  badge?: number;
}

const NAV_ITEMS: NavItem[] = [
  { icon: 'panel', label: 'Панель', path: null },
  { icon: 'tasks', label: 'Задачи', path: null, badge: 3 },
  { icon: 'portfolio', label: 'Портфель', path: null },
  { icon: 'deals', label: 'Сделки', path: null },
  { icon: 'clients', label: 'Клиенты', path: CLIENTS_LIST_PATH },
  { icon: 'pinning', label: 'Закрепление', path: null },
  { icon: 'leads', label: 'Лиды', path: null },
  { icon: 'champions', label: 'Лист чемпионов', path: null },
  { icon: 'reports', label: 'Отчёты', path: null },
  { icon: 'help', label: 'Помощь', path: null },
  { icon: 'teams', label: 'Клиентские команды', path: null },
  { icon: 'settings', label: 'Настройки', path: null },
];

function LayoutSfaInner() {
  const navigate = useNavigate();
  const location = useLocation();
  const { pin } = useParams<{ pin?: string }>();
  const client = pin ? getClientByPin(pin) : undefined;
  const { query, setQuery } = useSearch();

  useEffect(() => {
    if (location.pathname === CLIENTS_LIST_PATH) {
      setQuery('');
    } else if (client) {
      setQuery(client.pin);
    }
  }, [client, location.pathname, setQuery]);

  const isClientsArea =
    location.pathname === CLIENTS_LIST_PATH || location.pathname.startsWith('/client/');

  return (
    <div className={styles.shell}>
      <nav className={styles.nav} aria-label="Навигация SFA">
        <div className={styles.nav__logo}>
          <span className={styles.nav__logoMark}>SFA</span>
        </div>
        <div className={styles.nav__items}>
          {NAV_ITEMS.map((item) => {
            const isActive =
              item.path === CLIENTS_LIST_PATH && isClientsArea;
            return (
              <button
                key={item.label}
                type="button"
                className={`${styles.nav__item} ${isActive ? styles.nav__itemActive : ''}`}
                onClick={() => item.path && navigate(item.path)}
                title={item.path ? item.label : `${item.label} (скоро)`}
              >
                <span className={styles.nav__iconWrap}>
                  <SfaNavIcon id={item.icon} />
                  {item.badge !== undefined && (
                    <span className={styles.nav__badge}>{item.badge}</span>
                  )}
                </span>
                <span className={styles.nav__label}>{item.label}</span>
              </button>
            );
          })}
        </div>
      </nav>

      <div className={styles.body}>
        <header className={styles.topbar}>
          <div className={styles.search}>
            <span className={styles.search__icon}>🔍</span>
            <input
              className={styles.search__input}
              placeholder="Поиск..."
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === 'Enter') navigate(CLIENTS_LIST_PATH);
              }}
            />
          </div>
          <div className={styles.topbar__right}>
            <button type="button" className={styles.topbar__notify} title="Оповещения">
              <span className={styles.topbar__notifyIcon}>🔔</span>
              <span className={styles.topbar__notifyLabel}>Оповещения</span>
            </button>
            <div className={styles.topbar__user}>
              <span className={styles.topbar__avatar}>МЕ</span>
              <span className={styles.topbar__name}>Маркова Елена Сергеевна</span>
            </div>
          </div>
        </header>

        <SfaWorkspaceTabs />

        <main className={styles.main}>
          <Outlet />
        </main>
      </div>
    </div>
  );
}

export function LayoutSfa() {
  return (
    <SearchProvider>
      <LayoutSfaInner />
    </SearchProvider>
  );
}
