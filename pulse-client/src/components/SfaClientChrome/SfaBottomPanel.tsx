import styles from './SfaBottomPanel.module.css';

const BOTTOM_TABS = [
  'Задачи',
  'Операции',
  'Портфель',
  'Продукты',
  'Лиды',
  'Рекомендации',
  'Связи',
  'Сделки',
  'Сведения',
  'Заявки',
  'Скоринг',
  'Аналитика',
  'Проекты решений',
  'Кошельки и флаги',
  'Мониторинг',
] as const;

export function SfaBottomPanel() {
  return (
    <section className={styles.panel}>
      <div className={styles.tabs} role="tablist">
        {BOTTOM_TABS.map((tab, i) => (
          <button
            key={tab}
            type="button"
            className={`${styles.tab} ${i === 0 ? styles.tabActive : ''}`}
            disabled
          >
            {tab}
          </button>
        ))}
      </div>
      <div className={styles.subTabs}>
        <button type="button" className={`${styles.subTab} ${styles.subTabActive}`} disabled>
          Задачи
        </button>
        <button type="button" className={styles.subTab} disabled>
          История коммуникаций
        </button>
      </div>
      <div className={styles.tableWrap}>
        <h3 className={styles.tableTitle}>Текущие задачи</h3>
        <table className={styles.table}>
          <thead>
            <tr>
              <th>Тема задачи</th>
              <th>Время выполнения</th>
              <th>Канал создания</th>
              <th>Комментарий</th>
              <th>Исполнитель</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td colSpan={5} className={styles.empty}>
                <span className={styles.empty__icon}>📋</span>
                Нет записей
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </section>
  );
}
