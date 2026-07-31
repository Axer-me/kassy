import { Outlet } from 'react-router-dom';
import styles from './Layout.module.css';

export function LayoutDefault() {
  return (
    <div className={styles.layout}>
      <header className={styles.header}>
        <div className={styles.header__left}>
          <div className={styles.logo}>
            <div className={styles.logo__mark}>
              <svg viewBox="0 0 24 24" fill="none">
                <path
                  d="M6 12c0-3.3 2.7-6 6-6s6 2.7 6 6-2.7 6-6 6"
                  stroke="#fff"
                  strokeWidth="2"
                  strokeLinecap="round"
                />
                <circle cx="12" cy="12" r="2" fill="#fff" />
              </svg>
            </div>
            <span>Альфа-Банк</span>
          </div>
          <div className={styles.header__divider} />
          <span className={styles.header__title}>SFA — Пульс клиента</span>
        </div>
        <div className={styles.header__right}>
          <span className={styles.badgeSfa}>MVP</span>
          <span>Клиентский менеджер СКБ</span>
        </div>
      </header>
      <main className={styles.main}>
        <Outlet />
      </main>
    </div>
  );
}
