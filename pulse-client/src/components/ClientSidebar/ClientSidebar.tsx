import { useMemo, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import type { ClientSortField, SortDirection } from '../../data/clients';
import { searchClients, sortClients } from '../../data/clients';
import type { ClientPulse } from '../../types';
import { zoneColors } from '../../types';
import { useSearchOptional } from '../../context/SearchContext';
import styles from './ClientSidebar.module.css';

const SORT_OPTIONS: { field: ClientSortField; label: string }[] = [
  { field: 'pin', label: 'PIN' },
  { field: 'pulse', label: 'Пульс' },
];

export function ClientSidebar() {
  const [localQuery, setLocalQuery] = useState('');
  const [sortField, setSortField] = useState<ClientSortField>('pulse');
  const [sortDirection, setSortDirection] = useState<SortDirection>('desc');
  const searchCtx = useSearchOptional();
  const query = searchCtx?.query ?? localQuery;
  const setQuery = searchCtx?.setQuery ?? setLocalQuery;
  const { pin } = useParams();
  const navigate = useNavigate();

  const filtered = useMemo(
    () => sortClients(searchClients(query), sortField, sortDirection),
    [query, sortField, sortDirection],
  );

  function handleSortField(field: ClientSortField) {
    setSortField(field);
  }

  function handleSortDirection(direction: SortDirection) {
    setSortDirection(direction);
  }

  return (
    <aside className={styles.sidebar}>
      <div className={styles.sidebar__header}>
        <h2 className={styles.sidebar__title}>Клиенты</h2>
        <div className={styles.search}>
          <svg
            className={styles.search__icon}
            width="16"
            height="16"
            viewBox="0 0 16 16"
            fill="none"
          >
            <circle cx="7" cy="7" r="5" stroke="currentColor" strokeWidth="1.5" />
            <path d="M11 11l3 3" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
          </svg>
          <input
            className={styles.search__input}
            placeholder="PIN..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
          />
        </div>
        <div className={styles.sort} role="group" aria-label="Сортировка">
          <label className={styles.sort__label} htmlFor="client-sort-field">
            Сортировка
          </label>
          <select
            id="client-sort-field"
            className={styles.sort__select}
            value={sortField}
            onChange={(e) => handleSortField(e.target.value as ClientSortField)}
          >
            {SORT_OPTIONS.map(({ field, label }) => (
              <option key={field} value={field}>
                {label}
              </option>
            ))}
          </select>
          <div className={styles.sort__direction} role="group" aria-label="Направление сортировки">
            <button
              type="button"
              className={`${styles.sort__dirBtn} ${sortDirection === 'asc' ? styles.sort__dirBtnActive : ''}`}
              onClick={() => handleSortDirection('asc')}
              aria-pressed={sortDirection === 'asc'}
              title="По возрастанию"
            >
              ↑ По возр.
            </button>
            <button
              type="button"
              className={`${styles.sort__dirBtn} ${sortDirection === 'desc' ? styles.sort__dirBtnActive : ''}`}
              onClick={() => handleSortDirection('desc')}
              aria-pressed={sortDirection === 'desc'}
              title="По убыванию"
            >
              ↓ По убыв.
            </button>
          </div>
        </div>
      </div>
      <ul className={styles.list}>
        {filtered.length === 0 ? (
          <li className={styles.empty}>Клиенты не найдены</li>
        ) : (
          filtered.map((client) => (
            <ClientItem
              key={client.pin}
              client={client}
              active={client.pin === pin}
              onClick={() => navigate(`/client/${client.pin}`)}
            />
          ))
        )}
      </ul>
    </aside>
  );
}

function ClientItem({
  client,
  active,
  onClick,
}: {
  client: ClientPulse;
  active: boolean;
  onClick: () => void;
}) {
  const color = zoneColors[client.zone].main;

  return (
    <li>
      <button
        type="button"
        className={`${styles.item} ${active ? styles.itemActive : ''}`}
        onClick={onClick}
      >
        <div className={styles.item__top}>
          <span className={styles.item__name}>{client.pin}</span>
        </div>
        <div className={styles.item__bottom}>
          <span className={styles.dot} style={{ background: color }} />
          <span className={styles.item__index}>
            {client.pulseIndex !== null
              ? `Индекс ${client.pulseIndex.toFixed(1)} · ${client.status}`
              : client.status}
          </span>
        </div>
      </button>
    </li>
  );
}
