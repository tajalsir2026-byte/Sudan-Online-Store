import jwt from 'jsonwebtoken';
import type { Request, Response, NextFunction } from 'express';

const JWT_SECRET = process.env.JWT_SECRET || 'sanad-dev-secret-key-change-in-production-2026';
const JWT_EXPIRES_IN = '12h';
const JWT_REFRESH_EXPIRES_IN = '7d';

export interface JwtPayload {
  actorId: string;
  actorName: string;
  actorRole: string;
  tenantId: string;
  branchId?: string;
}

export interface AuthenticatedRequest extends Request {
  tenantId: string;
  actorName: string;
  actorRole: string;
  actorId: string;
  branchId?: string;
}

/**
 * Generate a JWT access token for an authenticated user.
 */
export function generateAccessToken(payload: JwtPayload): string {
  return jwt.sign(payload, JWT_SECRET, { expiresIn: JWT_EXPIRES_IN });
}

/**
 * Generate a JWT refresh token (contains only actorId and tenantId).
 */
export function generateRefreshToken(payload: { actorId: string; tenantId: string }): string {
  return jwt.sign(payload, JWT_SECRET, { expiresIn: JWT_REFRESH_EXPIRES_IN });
}

/**
 * Verify and decode a JWT token.
 */
export function verifyToken(token: string): JwtPayload {
  return jwt.verify(token, JWT_SECRET) as JwtPayload;
}

/**
 * Express middleware: Extract and validate JWT from Authorization header.
 * Falls back to legacy header-based auth for backward compatibility.
 */
export const requireAuth = (req: Request, res: Response, next: NextFunction) => {
  const authHeader = req.headers.authorization;

  // Try JWT first
  if (authHeader && authHeader.startsWith('Bearer ')) {
    const token = authHeader.substring(7);
    try {
      const payload = verifyToken(token);
      (req as AuthenticatedRequest).tenantId = payload.tenantId;
      (req as AuthenticatedRequest).actorId = payload.actorId;
      (req as AuthenticatedRequest).actorName = payload.actorName;
      (req as AuthenticatedRequest).actorRole = payload.actorRole;
      (req as AuthenticatedRequest).branchId = payload.branchId;
      return next();
    } catch (err) {
      return res.status(401).json({ error: 'جلسة غير صالحة أو منتهية الصلاحية' });
    }
  }

  // Fallback: legacy header-based auth (for development / backward compatibility)
  const legacyTenantId = (req.headers['x-tenant-id'] as string) || 'tenant_alrowad';
  (req as AuthenticatedRequest).tenantId = legacyTenantId;
  (req as AuthenticatedRequest).actorName = (req.headers['x-actor-name'] as string) || 'أحمد الطيب الرواد';
  (req as AuthenticatedRequest).actorRole = (req.headers['x-actor-role'] as string) || 'owner';
  (req as AuthenticatedRequest).actorId = (req.headers['x-actor-id'] as string) || 'emp_owner_rowad';
  (req as AuthenticatedRequest).branchId = (req.headers['x-branch-id'] as string);
  next();
};

/**
 * Middleware: Require specific role(s) to access endpoint.
 */
export const requireRole = (...roles: string[]) => {
  return (req: Request, res: Response, next: NextFunction) => {
    const authReq = req as AuthenticatedRequest;
    if (!roles.includes(authReq.actorRole)) {
      return res.status(403).json({
        error: `ليس لديك صلاحية الوصول. الأدوار المطلوبة: ${roles.join(' أو ')}`,
      });
    }
    next();
  };
};
