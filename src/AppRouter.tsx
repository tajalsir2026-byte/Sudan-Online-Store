import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { ErrorBoundary } from './components/Common/ErrorBoundary.tsx';

// Lazy imports for code splitting
const AdminApp = React.lazy(() => import('./AdminApp.tsx'));
const MerchantApp = React.lazy(() => import('./App.tsx'));
const ClientApp = React.lazy(() => import('./SanadClientApp/SanadClientApp.tsx'));
const LandingPage = React.lazy(() => import('./components/Landing/LandingPage.tsx'));
const LoginPage = React.lazy(() => import('./components/Auth/LoginPage.tsx'));

/**
 * Loading fallback for lazy components
 */
const LoadingFallback = () => (
  <div className="min-h-screen bg-slate-50 flex items-center justify-center" dir="rtl">
    <div className="text-center">
      <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-gradient-to-br from-emerald-500 to-emerald-700 shadow-lg mb-4">
        <svg className="w-8 h-8 text-white animate-spin" viewBox="0 0 24 24" fill="none">
          <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="3" strokeOpacity="0.3" />
          <path d="M12 2a10 10 0 0 1 10 10" stroke="currentColor" strokeWidth="3" strokeLinecap="round" />
        </svg>
      </div>
      <p className="text-sm text-slate-500">جاري التحميل...</p>
    </div>
  </div>
);

/**
 * Root Router — separates the three apps:
 *   /admin      → Super Admin (منصة إدارة السند)
 *   /merchant   → Merchant POS (تاجر السند)
 *   /client     → Public Client (تطبيق الجمهور)
 *   /           → Landing page
 *   /login      → Login page
 */
export const AppRouter: React.FC = () => {
  return (
    <ErrorBoundary>
      <React.Suspense fallback={<LoadingFallback />}>
        <Routes>
          {/* Landing Page — app selector */}
          <Route path="/" element={<LandingPage />} />
          <Route path="/login" element={<LoginPage />} />

          {/* Super Admin — منصة إدارة السند */}
          <Route path="/admin/*" element={<AdminApp />} />

          {/* Merchant — تطبيق التاجر (POS) */}
          <Route path="/merchant/*" element={<MerchantApp />} />
          <Route path="/m/:tenantSlug" element={<MerchantApp />} />

          {/* Client — تطبيق الجمهور */}
          <Route path="/client/*" element={<ClientApp />} />
          <Route path="/c/:tenantSlug" element={<ClientApp />} />

          {/* Fallback */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </React.Suspense>
    </ErrorBoundary>
  );
}
