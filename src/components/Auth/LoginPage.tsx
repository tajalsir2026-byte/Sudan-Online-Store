import React from 'react';
import { Navigate } from 'react-router-dom';

/**
 * Simple redirect page — users should choose their app from the landing page.
 */
export default function LoginPage() {
  return <Navigate to="/" replace />;
}
