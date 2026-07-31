import type { ClientPulse } from '../../types';
import styles from './SfaMainTabContent.module.css';

interface SfaMainTabContentProps {
  client: ClientPulse;
  tab: string;
}

export function SfaMainTabContent({ client, tab }: SfaMainTabContentProps) {
  if (tab !== 'Основное') {
    return (
      <div className={styles.placeholder}>
        <h2>{tab}</h2>
        <p>Раздел «{tab}» не входит в MVP виджета «Пульс клиента».</p>
      </div>
    );
  }

  const commercial = client.companyName
    .replace(/ООО «|»|АО «|ИП /g, '')
    .trim();

  const ogrn = '1' + client.inn.slice(0, 12) + '1';
  const kpp = client.inn.slice(0, 9) + '01';

  return (
    <div className={styles.wrap}>
      <div className={styles.grid}>
        <section className={styles.col}>
          <Field label="Юридическое наименование" value={client.companyName} />
          <Field label="Коммерческое наименование" value={commercial} link />
          <div className={styles.field}>
            <a href="#" className={styles.field__link} onClick={(e) => e.preventDefault()}>
              Прочие наименования
            </a>
          </div>
          <div className={styles.fieldRow}>
            <Field label="ОГРН" value={ogrn} inline />
            <span className={styles.fieldRow__sep}>|</span>
            <Field label="КПП" value={kpp} inline />
          </div>
          <Field label="Рекомендованный сегмент группы" value="500–10000 млн" />
          <Field label="Подтверждённый сегмент компании" value="500–10000" />
        </section>
        <section className={styles.col}>
          <Field label="ЦПР" value={commercial} link />
          <Field
            label="Клиентская команда"
            value="Москва, Упр 1 Отд 4, Команда 4 · Детали"
            link
          />
          <Field label="Универсальный клиентский менеджер" value="Маркова Елена Сергеевна" link />
          <Field label="Категория бизнеса" value="Средний корпоративный бизнес" />
          <div className={styles.field}>
            <a href="#" className={styles.field__link} onClick={(e) => e.preventDefault()}>
              Закрепления
            </a>
          </div>
        </section>
        <aside className={styles.comments}>
          <h3 className={styles.comments__title}>Комментарии</h3>
          <div className={styles.comments__box}>
            {client.briefAssessment ? <p>{client.briefAssessment}</p> : null}
          </div>
          <div className={styles.linksRow}>
            <span className={styles.linksTitle}>Полезные ссылки</span>
            <div className={styles.links}>
              {['CRM BMB', 'LM', 'ECKO', 'Эл. архив', 'СКС', 'Анкета ИЗК'].map((name) => (
                <a key={name} href="#" onClick={(e) => e.preventDefault()}>
                  {name}
                </a>
              ))}
            </div>
          </div>
        </aside>
      </div>
    </div>
  );
}

function Field({
  label,
  value,
  link,
  inline,
}: {
  label: string;
  value: string;
  link?: boolean;
  inline?: boolean;
}) {
  return (
    <div className={`${styles.field} ${inline ? styles.field_inline : ''}`}>
      <span className={styles.field__label}>{label}</span>
      {link ? (
        <a href="#" className={styles.field__link} onClick={(e) => e.preventDefault()}>
          {value}
        </a>
      ) : (
        <span className={styles.field__value}>{value}</span>
      )}
    </div>
  );
}
