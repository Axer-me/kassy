import { Navigate, useParams } from 'react-router-dom';
import { defaultClientPath } from '../config/routes';
import { isSfaTheme } from '../config/theme';
import { ClientSidebar } from '../components/ClientSidebar/ClientSidebar';
import { PulseWidget } from '../components/PulseWidget/PulseWidget';
import { SfaBottomPanel } from '../components/SfaClientChrome/SfaBottomPanel';
import { SfaClientChrome } from '../components/SfaClientChrome/SfaClientChrome';
import { SfaFloatingChrome } from '../components/SfaClientChrome/SfaFloatingChrome';
import { getClientByPin } from '../data/clients';
import styles from './pages.module.css';

export function ClientCardPage() {
  const { pin } = useParams<{ pin: string }>();
  const client = pin ? getClientByPin(pin) : undefined;
  const sfa = isSfaTheme();

  if (!client) {
    return <Navigate to={defaultClientPath()} replace />;
  }

  if (sfa) {
    return (
      <div className={styles.pageSfaCard}>
        <SfaClientChrome client={client} />
        <div className={styles.pageSfaMain}>
          <PulseWidget client={client} variant="embedded" />
        </div>
        <SfaBottomPanel />
        <SfaFloatingChrome />
      </div>
    );
  }

  return (
    <div className={styles.page}>
      <ClientSidebar />
      <div className={styles.content}>
        <PulseWidget client={client} variant="standalone" />
      </div>
    </div>
  );
}
