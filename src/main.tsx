import { createRoot } from 'react-dom/client';
import { HashRouter } from 'react-router-dom';
import { AppRouter } from './AppRouter.tsx';
import { ErrorBoundary } from './components/Common/ErrorBoundary.tsx';
import './index.css';

// Detect app type from HTML file
declare global {
  interface Window {
    SANAD_APP_TYPE?: 'admin' | 'merchant' | 'client';
  }
}

const appType = window.SANAD_APP_TYPE || 'admin';
const initialRoute = `#/${appType}`;

if (window.location.hash === '' || window.location.hash === '#') {
  window.location.hash = initialRoute;
}

createRoot(document.getElementById('root')!).render(
  <ErrorBoundary>
    <HashRouter>
      <AppRouter />
    </HashRouter>
  </ErrorBoundary>
);
