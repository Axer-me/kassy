import { useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import type { ClientSortField, SortDirection } from '../../data/clients';
import { searchClients, sortClients } from '../../data/clients';
import type { ClientPulse, PulseZone } from '../../types';
import { zoneColors } from '../../types';
import { useSearchOptional } from '../../context/SearchContext';
import styles from './ClientSearchView.module.css';

const SORT_OPTIONS: { field: ClientSortField; label: string }[] = [
  { field: 'pin', label: 'PIN' },
  { field: 'pulse', label: 'Пульс' },
];

const ZONE_FILTERS: { id: PulseZone | 'all'; label: string }[] = [
  { id: 'all', label: 'Все' },
  { id: 'critical', label: 'Критики' },
  { id: 'neutral', label: 'Нейтральные' },
  { id: 'loyal', label: 'Лояльные' },
  { id: 'unknown', label: 'Нет данных' },
];

export function ClientSearchView() {
  const [localQuery, setLocalQuery] = useState('');
  const [sortField, setSortField] = useState<ClientSortField>('pulse');
  const [sortDirection, setSortDirection] = useState<SortDirection>('desc');
  const [zoneFilter, setZoneFilter] = useState<PulseZone | 'all'>('all');
  const searchCtx = useSearchOptional();
  const query = searchCtx?.query ?? localQuery;
  const setQuery = searchCtx?.setQuery ?? setLocalQuery;
  const navigate = useNavigate();

  const searchResults = useMemo(() => searchClients(query), [query]);

  const stats = useMemo(
    () => ({
      total: searchResults.length,
      critical: searchResults.filter((c) => c.zone === 'critical').length,
      neutral: searchResults.filter((c) => c.zone === 'neutral').length,
      loyal: searchResults.filter((c) => c.zone === 'loyal').length,
      unknown: searchResults.filter((c) => c.zone === 'unknown').length,
    }),
    [searchResults],
  );

  const filtered = useMemo(() => {
    let items = sortClients(searchResults, sortField, sortDirection);
    if (zoneFilter !== 'all') {
      items = items.filter((c) => c.zone === zoneFilter);
    }
    return items;
  }, [searchResults, sortField, sortDirection, zoneFilter]);

  function zoneCount(zone: PulseZone | 'all'): number {
    if (zone === 'all') return searchResults.length;
    return searchResults.filter((c) => c.zone === zone).length;
  }

  return (
    <div className={styles.page}>
      <header className={styles.header}>
        <div className={styles.header__text}>
          <h1 className={styles.title}>Поиск клиентов</h1>
          <p className={styles.subtitle}>
            Портфель СКБ — найдите клиента по PIN и откройте карточку «Пульс клиента»
          </p>
        </div>
        <div className={styles.stats}>
          <StatChip label="Всего" value={stats.total} />
          <StatChip label="Критики" value={stats.critical} color={zoneColors.critical.main} />
          <StatChip label="Нейтральные" value={stats.neutral} color={zoneColors.neutral.main} />
          <StatChip label="Лояльные" value={stats.loyal} color={zoneColors.loyal.main} />
        </div>
      </header>

      <div className={styles.toolbar}>
        <div className={styles.search}>
          <svg className={styles.search__icon} width="16" height="16" viewBox="0 0 16 16" fill="none" aria-hidden>
            <circle cx="7" cy="7" r="5" stroke="currentColor" strokeWidth="1.5" />
            <path d="M11 11l3 3" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
          </svg>
          <input
            className={styles.search__input}
            placeholder="Введите PIN клиента..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            aria-label="Поиск по PIN"
          />
          {query && (
            <button
              type="button"
              className={styles.search__clear}
              onClick={() => setQuery('')}
              aria-label="Очистить поиск"
            >
              ×
            </button>
          )}
        </div>

        <div className={styles.toolbar__controls}>
          <label className={styles.sortLabel} htmlFor="search-sort">
            Сортировка
          </label>
          <select
            id="search-sort"
            className={styles.sortSelect}
            value={sortField}
            onChange={(e) => setSortField(e.target.value as ClientSortField)}
          >
            {SORT_OPTIONS.map(({ field, label }) => (
              <option key={field} value={field}>
                {label}
              </option>
            ))}
          </select>
          <div className={styles.sortDir} role="group" aria-label="Направление сортировки">
            <button
              type="button"
              className={`${styles.sortDir__btn} ${sortDirection === 'asc' ? styles.sortDir__btnActive : ''}`}
              onClick={() => setSortDirection('asc')}
              aria-pressed={sortDirection === 'asc'}
              title="По возрастанию"
            >
              ↑
            </button>
            <button
              type="button"
              className={`${styles.sortDir__btn} ${sortDirection === 'desc' ? styles.sortDir__btnActive : ''}`}
              onClick={() => setSortDirection('desc')}
              aria-pressed={sortDirection === 'desc'}
              title="По убыванию"
            >
              ↓
            </button>
          </div>
        </div>
      </div>

      <div className={styles.filters} role="group" aria-label="Фильтр по зоне пульса">
        {ZONE_FILTERS.map(({ id, label }) => {
          const count = zoneCount(id);
          if (id !== 'all' && count === 0) return null;
          return (
            <button
              key={id}
              type="button"
              className={`${styles.filterChip} ${zoneFilter === id ? styles.filterChipActive : ''}`}
              onClick={() => setZoneFilter(id)}
            >
              {label}
              <span className={styles.filterChip__count}>{count}</span>
            </button>
          );
        })}
      </div>

      <div className={styles.resultsMeta}>
        Найдено: <strong>{filtered.length}</strong>
        {query && (
          <span className={styles.resultsMeta__query}>
            по запросу «{query}»
          </span>
        )}
      </div>

      <div className={styles.tableWrap}>
        {filtered.length === 0 ? (
          <div className={styles.empty}>
            <span className={styles.empty__icon}>🔍</span>
            <p className={styles.empty__title}>Клиенты не найдены</p>
            <p className={styles.empty__hint}>
              Попробуйте изменить PIN или сбросить фильтр зоны
            </p>
            {(query || zoneFilter !== 'all') && (
              <button
                type="button"
                className={styles.empty__btn}
                onClick={() => {
                  setQuery('');
                  setZoneFilter('all');
                }}
              >
                Сбросить фильтры
              </button>
            )}
          </div>
        ) : (
          <table className={styles.table}>
            <thead>
              <tr>
                <th className={styles.colPin}>PIN</th>
                <th className={styles.colPulse}>Пульс</th>
                <th className={styles.colStatus}>Статус</th>
                <th className={styles.colInterpretation}>Интерпретация индекса</th>
                <th className={styles.table__actionCol} aria-label="Действие" />
              </tr>
            </thead>
            <tbody>
              {filtered.map((client) => (
                <ClientRow
                  key={client.pin}
                  client={client}
                  onOpen={() => navigate(`/client/${client.pin}`)}
                />
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}

function StatChip({
  label,
  value,
  color,
}: {
  label: string;
  value: number;
  color?: string;
}) {
  return (
    <div className={styles.statChip}>
      <span className={styles.statChip__value} style={color ? { color } : undefined}>
        {value}
      </span>
      <span className={styles.statChip__label}>{label}</span>
    </div>
  );
}

function ClientRow({
  client,
  onOpen,
}: {
  client: ClientPulse;
  onOpen: () => void;
}) {
  const colors = zoneColors[client.zone];
  const pulseValue =
    client.pulseIndex !== null ? client.pulseIndex.toFixed(1) : '—';

  return (
    <tr className={styles.row} onClick={onOpen} tabIndex={0} onKeyDown={(e) => e.key === 'Enter' && onOpen()}>
      <td>
        <span className={styles.pin}>{client.pin}</span>
      </td>
      <td>
        <div className={styles.pulse}>
          <span
            className={styles.pulse__dot}
            style={{ background: colors.main }}
            aria-hidden
          >
            {pulseValue}
          </span>
        </div>
      </td>
      <td>
        <span
          className={styles.status}
          style={{ background: colors.light, color: colors.main }}
        >
          {client.status}
        </span>
      </td>
      <td className={styles.colInterpretation}>
        <p className={styles.interpretation} title={client.briefAssessment}>
          {client.briefAssessment}
        </p>
      </td>
      <td className={styles.table__actionCol}>
        <span className={styles.row__arrow} aria-hidden>→</span>
      </td>
    </tr>
  );
}

