import { createRoot } from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import { AppRouter } from './AppRouter.tsx';
import { ErrorBoundary } from './components/Common/ErrorBoundary.tsx';
import './index.css';

createRoot(document.getElementById('root')!).render(
  <ErrorBoundary>
    <BrowserRouter>
      <AppRouter />
    </BrowserRouter>
  </ErrorBoundary>
);
