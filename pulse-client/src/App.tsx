import { Routes, Route, Navigate } from 'react-router-dom';
import { Layout } from './components/Layout/Layout';
import { ClientListPage } from './pages/ClientListPage';
import { ClientCardPage } from './pages/ClientCardPage';
import { CLIENTS_LIST_PATH, defaultClientPath } from './config/routes';

export default function App() {
  return (
    <Routes>
      <Route element={<Layout />}>
        <Route index element={<Navigate to={defaultClientPath()} replace />} />
        <Route path={CLIENTS_LIST_PATH.slice(1)} element={<ClientListPage />} />
        <Route path="client/:pin" element={<ClientCardPage />} />
        <Route path="*" element={<Navigate to={defaultClientPath()} replace />} />
      </Route>
    </Routes>
  );
}
