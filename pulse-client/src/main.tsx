import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { HashRouter } from 'react-router-dom';
import { APP_THEME } from './config/theme';
import App from './App';
import './styles/global.css';
import './styles/themes/sfa.css';

document.documentElement.dataset.theme = APP_THEME;

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <HashRouter>
      <App />
    </HashRouter>
  </StrictMode>,
);