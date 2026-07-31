import styles from './SfaFloatingChrome.module.css';

export function SfaFloatingChrome() {
  return (
    <>
      <button type="button" className={styles.chat} title="Чат" aria-label="Чат">
        <span className={styles.chat__icon}>💬</span>
        <span className={styles.chat__badge}>52</span>
      </button>
      <button type="button" className={styles.collapse} disabled>
        Свернуть все окна
      </button>
    </>
  );
}
