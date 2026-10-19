import express from 'express';
import path from 'path';
import { fileURLToPath } from 'url';
import { createServer as createViteServer } from 'vite';
import { apiRouter } from './src/server/routes.ts';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

/* =========================================================================
   Rate Limiter (in-memory, no external dependency needed)
   ========================================================================= */
interface RateLimitEntry {
  count: number;
  resetAt: number;
}

const rateLimitStore = new Map<string, RateLimitEntry>();

function rateLimiter(opts: { windowMs: number; max: number; keyPrefix?: string }) {
  const { windowMs, max, keyPrefix = 'rl' } = opts;
  return (req: express.Request, res: express.Response, next: express.NextFunction) => {
    const ip = req.ip || req.socket.remoteAddress || 'unknown';
    const key = `${keyPrefix}:${ip}:${req.path}`;
    const now = Date.now();

    let entry = rateLimitStore.get(key);
    if (!entry || now > entry.resetAt) {
      entry = { count: 0, resetAt: now + windowMs };
      rateLimitStore.set(key, entry);
    }

    entry.count++;

    // Set rate limit headers
    res.setHeader('X-RateLimit-Limit', max);
    res.setHeader('X-RateLimit-Remaining', Math.max(0, max - entry.count));

    if (entry.count > max) {
      res.status(429).json({
        error: 'تم تجاوز الحد الأقصى للطلبات. يرجى المحاولة بعد قليل.',
        retryAfter: Math.ceil((entry.resetAt - now) / 1000),
      });
      return;
    }

    next();
  };
}

// Periodically clean up expired entries to prevent memory leak
setInterval(() => {
  const now = Date.now();
  for (const [key, entry] of rateLimitStore) {
    if (now > entry.resetAt) {
      rateLimitStore.delete(key);
    }
  }
}, 60_000); // Clean up every minute

/* =========================================================================
   CORS Configuration
   ========================================================================= */
function corsMiddleware(allowedOrigins?: string[]) {
  const origins = allowedOrigins || [
    'http://localhost:3000',
    'http://localhost:5173',
    'https://sudan-online-store.vercel.app',
  ];

  return (req: express.Request, res: express.Response, next: express.NextFunction) => {
    const origin = req.headers.origin as string;

    // Allow requests from configured origins
    if (origin && origins.includes(origin)) {
      res.setHeader('Access-Control-Allow-Origin', origin);
    }

    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, PATCH, OPTIONS');
    res.setHeader(
      'Access-Control-Allow-Headers',
      'Content-Type, Authorization, x-tenant-id, x-actor-id, x-actor-name, x-actor-role, x-branch-id'
    );
    res.setHeader('Access-Control-Allow-Credentials', 'true');
    res.setHeader('Access-Control-Max-Age', '86400');

    // Handle preflight
    if (req.method === 'OPTIONS') {
      res.status(204).end();
      return;
    }

    next();
  };
}

/* =========================================================================
   Security Headers
   ========================================================================= */
function securityHeaders(_req: express.Request, res: express.Response, next: express.NextFunction) {
  res.setHeader('X-Content-Type-Options', 'nosniff');
  res.setHeader('X-Frame-Options', 'DENY');
  res.setHeader('X-XSS-Protection', '1; mode=block');
  res.setHeader('Referrer-Policy', 'strict-origin-when-cross-origin');
  res.setHeader('Permissions-Policy', 'camera=(self), microphone=()');
  next();
}

/* =========================================================================
   Server Startup
   ========================================================================= */
async function startServer() {
  const app = express();
  const PORT = process.env.PORT ? parseInt(process.env.PORT, 10) : 3000;
  const isProd = process.env.NODE_ENV === 'production';

  // Security middleware (first!)
  app.use(securityHeaders);
  app.use(corsMiddleware());

  // Rate limiting — stricter on auth endpoints
  app.use('/api/auth/login', rateLimiter({ windowMs: 15 * 60_000, max: 20, keyPrefix: 'auth' }));
  app.use('/api/auth/refresh', rateLimiter({ windowMs: 15 * 60_000, max: 30, keyPrefix: 'refresh' }));
  app.use('/api', rateLimiter({ windowMs: 60_000, max: 300, keyPrefix: 'api' }));

  app.use(express.json({ limit: '10mb' }));
  app.use(express.urlencoded({ extended: true, limit: '10mb' }));

  // Static assets for generated photos
  app.use('/src/assets', express.static(path.resolve(__dirname, 'src/assets')));

  // Mount API Router
  app.use('/api', apiRouter);

  // Health check endpoint (outside rate limiter for monitoring)
  app.get('/api/health', (req, res) => {
    res.json({ status: 'ok', service: 'Sanad POS Multi-Tenant SaaS Server', timestamp: new Date().toISOString() });
  });

  if (!isProd) {
    // Development: Integrate Vite dev server middleware
    const vite = await createViteServer({
      server: { middlewareMode: true, hmr: process.env.DISABLE_HMR !== 'true' },
      appType: 'spa',
    });
    app.use(vite.middlewares);
    console.log('[Sanad POS Server] Vite dev middleware mounted');
  } else {
    // Production: serve built static files
    app.use(express.static(path.resolve(__dirname, 'dist')));
    app.get('*', (req, res) => {
      res.sendFile(path.resolve(__dirname, 'dist', 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`[Sanad POS Server] Server running on http://0.0.0.0:${PORT}`);
    console.log(`[Sanad POS Server] Environment: ${isProd ? 'production' : 'development'}`);
  });
}

startServer().catch((err) => {
  console.error('[Sanad POS Server] Failed to start:', err);
  process.exit(1);
});
