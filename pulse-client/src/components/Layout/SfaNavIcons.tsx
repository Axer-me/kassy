import type { ReactNode } from 'react';
import styles from './SfaNavIcons.module.css';

export type SfaNavIconId =
  | 'panel'
  | 'tasks'
  | 'portfolio'
  | 'deals'
  | 'clients'
  | 'pinning'
  | 'leads'
  | 'champions'
  | 'reports'
  | 'help'
  | 'teams'
  | 'settings';

interface SfaNavIconProps {
  id: SfaNavIconId;
}

export function SfaNavIcon({ id }: SfaNavIconProps) {
  return (
    <svg
      className={styles.icon}
      viewBox="0 0 24 24"
      width="20"
      height="20"
      aria-hidden
      fill="none"
      stroke="currentColor"
      strokeWidth="1.6"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      {ICON_PATHS[id]}
    </svg>
  );
}

const ICON_PATHS: Record<SfaNavIconId, ReactNode> = {
  panel: (
    <>
      <rect x="3" y="3" width="8" height="8" rx="1" />
      <rect x="13" y="3" width="8" height="8" rx="1" />
      <rect x="3" y="13" width="8" height="8" rx="1" />
      <rect x="13" y="13" width="8" height="8" rx="1" />
    </>
  ),
  tasks: (
    <>
      <path d="M9 6h12M9 12h12M9 18h12" />
      <path d="M5 6h.01M5 12h.01M5 18h.01" strokeWidth="2.4" />
    </>
  ),
  portfolio: (
    <>
      <rect x="4" y="7" width="16" height="13" rx="1.5" />
      <path d="M9 7V6a3 3 0 0 1 6 0v1" />
    </>
  ),
  deals: (
    <>
      <circle cx="8" cy="12" r="3.5" />
      <circle cx="16" cy="12" r="3.5" />
      <path d="M11.2 12h1.6" />
    </>
  ),
  clients: (
    <>
      <circle cx="12" cy="8" r="3.5" />
      <path d="M5 20c0-3.5 3.1-6 7-6s7 2.5 7 6" />
    </>
  ),
  pinning: <path d="M12 21V11M12 11l4-2-2-6-6 2 4 2z" />,
  leads: (
    <>
      <circle cx="9" cy="9" r="2.5" />
      <circle cx="15" cy="9" r="2.5" />
      <path d="M4 19c0-2.5 2.2-4.5 5-4.5M15 14.5c2.8 0 5 2 5 4.5" />
    </>
  ),
  champions: (
    <>
      <path d="M7 6h10M7 10h10M7 14h6" />
      <path d="M5 6h.01M5 10h.01M5 14h.01" strokeWidth="2.4" />
    </>
  ),
  reports: (
    <>
      <path d="M7 4h10v16H7z" />
      <path d="M10 14v-3M13 16V9M16 12V8" strokeWidth="1.8" />
    </>
  ),
  help: (
    <>
      <circle cx="12" cy="12" r="8" />
      <path d="M9.5 9.5a2.5 2.5 0 1 1 4.2 1.8c-.8.7-1.7 1.2-1.7 2.2" />
      <path d="M12 17h.01" strokeWidth="2.4" />
    </>
  ),
  teams: (
    <>
      <path d="M4 20V8l8-4 8 4v12" />
      <path d="M9 20v-6h6v6" />
    </>
  ),
  settings: (
    <>
      <circle cx="12" cy="12" r="3" />
      <path d="M12 3v2M12 19v2M3 12h2M19 12h2M5.6 5.6l1.4 1.4M17 17l1.4 1.4M5.6 18.4l1.4-1.4M17 7l1.4-1.4" />
    </>
  ),
};
