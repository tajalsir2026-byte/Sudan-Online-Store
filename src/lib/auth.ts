/**
 * Client-side authentication utilities.
 * Manages JWT tokens in memory + localStorage for persistence.
 */

const TOKEN_KEY = 'sanad_access_token';
const REFRESH_KEY = 'sanad_refresh_token';
const USER_KEY = 'sanad_auth_user';

interface AuthUser {
  id: string;
  name: string;
  email: string;
  role: string;
  branchId?: string;
  permissions: string[];
}

interface LoginResponse {
  success: boolean;
  accessToken: string;
  refreshToken: string;
  employee: AuthUser;
  tenant: {
    id: string;
    name: string;
    tradeName: string;
    city: string;
  };
}

/**
 * Login with email or PIN.
 */
export async function login(params: {
  email?: string;
  pin?: string;
  tenantId?: string;
  role?: string;
}): Promise<LoginResponse> {
  const res = await fetch('/api/auth/login', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(params),
  });

  if (!res.ok) {
    const data = await res.json().catch(() => ({}));
    throw new Error(data.error || 'فشل تسجيل الدخول');
  }

  const data: LoginResponse = await res.json();

  // Store tokens
  setAccessToken(data.accessToken);
  setRefreshToken(data.refreshToken);
  setAuthUser(data.employee);

  return data;
}

/**
 * Logout — clear all auth state.
 */
export function logout(): void {
  localStorage.removeItem(TOKEN_KEY);
  localStorage.removeItem(REFRESH_KEY);
  localStorage.removeItem(USER_KEY);
}

// Token management
export function setAccessToken(token: string): void {
  localStorage.setItem(TOKEN_KEY, token);
}

export function getAccessToken(): string | null {
  return localStorage.getItem(TOKEN_KEY);
}

export function setRefreshToken(token: string): void {
  localStorage.setItem(REFRESH_KEY, token);
}

export function getRefreshToken(): string | null {
  return localStorage.getItem(REFRESH_KEY);
}

// User management
export function setAuthUser(user: AuthUser): void {
  localStorage.setItem(USER_KEY, JSON.stringify(user));
}

export function getAuthUser(): AuthUser | null {
  try {
    const raw = localStorage.getItem(USER_KEY);
    return raw ? JSON.parse(raw) : null;
  } catch {
    return null;
  }
}

export function isAuthenticated(): boolean {
  return !!getAccessToken();
}

/**
 * Refresh the access token using the refresh token.
 */
export async function refreshAccessToken(): Promise<string | null> {
  const refreshToken = getRefreshToken();
  if (!refreshToken) return null;

  try {
    const res = await fetch('/api/auth/refresh', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ refreshToken }),
    });

    if (!res.ok) {
      logout();
      return null;
    }

    const data = await res.json();
    setAccessToken(data.accessToken);
    return data.accessToken;
  } catch {
    return null;
  }
}

/**
 * Get authorization headers for API requests.
 */
export function getAuthHeaders(): Record<string, string> {
  const token = getAccessToken();
  if (token) {
    return { Authorization: `Bearer ${token}` };
  }
  return {};
}
