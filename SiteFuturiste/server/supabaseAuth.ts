import type { Express, RequestHandler } from 'express';
import session from 'express-session';
import connectPg from 'connect-pg-simple';

// Extend Express Session with custom properties
declare global {
  namespace Express {
    interface Session {
      userId?: string;
      email?: string;
      isAdmin?: boolean;
    }
  }
}

export function getSession() {
  const sessionTtl = 7 * 24 * 60 * 60 * 1000; // 1 week
  const pgStore = connectPg(session);
  const sessionStore = new pgStore({
    conString: process.env.DATABASE_URL,
    createTableIfMissing: false,
    ttl: sessionTtl,
    tableName: 'sessions',
  });

  return session({
    secret: process.env.SESSION_SECRET!,
    store: sessionStore,
    resave: false,
    saveUninitialized: false,
    cookie: {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: sessionTtl,
    },
  });
}

export async function setupAuth(app: Express) {
  app.set('trust proxy', 1);
  app.use(getSession());

  // Login endpoint - via Supabase API
  app.post('/api/auth/login', async (req, res) => {
    try {
      const { email, password } = req.body;
      
      const response = await fetch(`${process.env.SUPABASE_URL}/auth/v1/token?grant_type=password`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'apikey': process.env.SUPABASE_ANON_KEY!,
        },
        body: JSON.stringify({ email, password }),
      });

      if (!response.ok) {
        return res.status(401).json({ message: 'Invalid credentials' });
      }

      const data = await response.json();
      req.session.userId = data.user.id;
      req.session.email = data.user.email;
      req.session.save(() => {
        res.json({
          success: true,
          user: { id: data.user.id, email: data.user.email },
        });
      });
    } catch (error) {
      console.error('Login error:', error);
      res.status(500).json({ message: 'Login failed' });
    }
  });

  // Register endpoint - via Supabase API
  app.post('/api/auth/register', async (req, res) => {
    try {
      const { email, password } = req.body;

      const response = await fetch(`${process.env.SUPABASE_URL}/auth/v1/signup`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'apikey': process.env.SUPABASE_ANON_KEY!,
        },
        body: JSON.stringify({ email, password }),
      });

      if (!response.ok) {
        const error = await response.json();
        return res.status(400).json({ message: error.message || 'Registration failed' });
      }

      res.status(201).json({ success: true });
    } catch (error) {
      console.error('Register error:', error);
      res.status(500).json({ message: 'Registration failed' });
    }
  });

  // Logout endpoint
  app.post('/api/auth/logout', (req, res) => {
    req.session.destroy(() => {
      res.json({ success: true });
    });
  });

  // Get current user
  app.get('/api/auth/user', (req, res) => {
    if (!req.session.userId) {
      return res.status(401).json({ message: 'Not authenticated' });
    }
    res.json({
      id: req.session.userId,
      email: req.session.email,
    });
  });

  // Verify admin secret
  app.post('/api/auth/verify-admin', async (req, res) => {
    try {
      if (!req.session.userId) {
        return res.status(401).json({ message: 'Not authenticated' });
      }

      const { secret } = req.body;
      const correctSecret = 'snoopy';

      if (secret === correctSecret) {
        req.session.isAdmin = true;
        req.session.save(() => {
          res.json({ isAdmin: true });
        });
      } else {
        res.status(403).json({ isAdmin: false });
      }
    } catch (error) {
      console.error('Admin verification error:', error);
      res.status(500).json({ message: 'Verification failed' });
    }
  });

  // Check admin status
  app.get('/api/auth/admin-status', (req, res) => {
    if (!req.session.userId) {
      return res.status(401).json({ isAdmin: false });
    }
    res.json({ isAdmin: req.session.isAdmin || false });
  });
}

// Middleware: Check if authenticated
export const isAuthenticated: RequestHandler = (req, res, next) => {
  if (!req.session.userId) {
    return res.status(401).json({ message: 'Unauthorized' });
  }
  next();
};

// Middleware: Check if admin
export const isAdmin: RequestHandler = (req, res, next) => {
  if (!req.session.userId || !req.session.isAdmin) {
    return res.status(403).json({ message: 'Forbidden - Admin access required' });
  }
  next();
};
