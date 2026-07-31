import { useLocation, useNavigate, useParams } from 'react-router-dom';
import { CLIENTS_LIST_PATH, defaultClientPath } from '../../config/routes';
import { getClientByPin } from '../../data/clients';
import styles from './SfaWorkspaceTabs.module.css';

export function SfaWorkspaceTabs() {
  const navigate = useNavigate();
  const location = useLocation();
  const { pin } = useParams<{ pin?: string }>();
  const client = pin ? getClientByPin(pin) : undefined;

  const isSearch = location.pathname === CLIENTS_LIST_PATH;
  const isClient = Boolean(pin && client);

  return (
    <div className={styles.bar}>
      <div className={styles.tabs}>
        <span className={`${styles.tab} ${styles.tabStatic}`} role="tab" aria-selected={false}>
          Панель
        </span>
        <button
          type="button"
          className={`${styles.tab} ${isSearch ? styles.tabActive : ''}`}
          onClick={() => navigate(CLIENTS_LIST_PATH)}
        >
          Поиск клиентов
          {isSearch && (
            <span
              className={styles.tab__close}
              onClick={(e) => {
                e.stopPropagation();
                navigate(defaultClientPath());
              }}
              role="button"
              tabIndex={0}
              aria-label="Закрыть вкладку"
            >
              ×
            </span>
          )}
        </button>
        {isClient && client && (
          <button type="button" className={`${styles.tab} ${styles.tabActive}`}>
            <span className={styles.tab__label}>{client.pin}</span>
            <span
              className={styles.tab__close}
              onClick={(e) => {
                e.stopPropagation();
                navigate(CLIENTS_LIST_PATH);
              }}
              role="button"
              tabIndex={0}
              aria-label="Закрыть вкладку"
            >
              ×
            </span>
          </button>
        )}
      </div>
      <button type="button" className={styles.historyBtn} title="История" aria-label="История">
        ↺
      </button>
    </div>
  );
}
