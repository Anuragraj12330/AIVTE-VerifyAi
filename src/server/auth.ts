import { Router, Request, Response } from 'express';
import crypto from 'crypto';
import fs from 'fs';
import path from 'path';

export interface StoredUser {
  id: string;
  name: string;
  email: string;
  salt: string;
  passwordHash: string;
  role: 'Regulatory Director' | 'Senior Auditor' | 'Scrutiny Officer' | 'Institutional Representative';
  designation: string;
  institution?: string;
  avatar?: string;
  createdAt: string;
}

export interface StoredSession {
  token: string;
  userId: string;
  createdAt: string;
  expiresAt: string;
}

export interface PasswordResetToken {
  token: string;
  email: string;
  expiresAt: string;
}

interface AuthDatabase {
  users: Record<string, StoredUser>; // keyed by lowercased email
  sessions: Record<string, StoredSession>; // keyed by token
  resetTokens: Record<string, PasswordResetToken>; // keyed by reset token
}

const DATA_DIR = path.resolve(process.cwd(), '.data');
const DB_FILE = path.resolve(DATA_DIR, 'auth_store.json');

// Cryptographic helpers
function hashPassword(password: string, salt?: string): { salt: string; hash: string } {
  const activeSalt = salt || crypto.randomBytes(16).toString('hex');
  const hash = crypto.scryptSync(password, activeSalt, 64).toString('hex');
  return { salt: activeSalt, hash };
}

function verifyPassword(password: string, salt: string, expectedHash: string): boolean {
  try {
    const hash = crypto.scryptSync(password, salt, 64).toString('hex');
    const hashBuf = Buffer.from(hash, 'hex');
    const expectedBuf = Buffer.from(expectedHash, 'hex');
    if (hashBuf.length !== expectedBuf.length) return false;
    return crypto.timingSafeEqual(hashBuf, expectedBuf);
  } catch (err) {
    return false;
  }
}

function generateSecureToken(): string {
  return crypto.randomBytes(32).toString('hex');
}

// In-memory DB state with disk persistence
let db: AuthDatabase = {
  users: {},
  sessions: {},
  resetTokens: {},
};

function saveDbToDisk() {
  try {
    if (!fs.existsSync(DATA_DIR)) {
      fs.mkdirSync(DATA_DIR, { recursive: true });
    }
    fs.writeFileSync(DB_FILE, JSON.stringify(db, null, 2), 'utf-8');
  } catch (err) {
    console.error('Failed to persist auth database to disk:', err);
  }
}

function loadDbFromDisk() {
  try {
    if (fs.existsSync(DB_FILE)) {
      const data = fs.readFileSync(DB_FILE, 'utf-8');
      const parsed = JSON.parse(data);
      db = {
        users: parsed.users || {},
        sessions: parsed.sessions || {},
        resetTokens: parsed.resetTokens || {},
      };
      return;
    }
  } catch (err) {
    console.warn('Could not read existing auth_store.json, creating initial state:', err);
  }

  // Seed standard regulatory institutional users with secure scrypt hashes
  const officerHash = hashPassword('AICTE@Admin2026!');
  const reviewerHash = hashPassword('Reviewer@2026!');

  const user1: StoredUser = {
    id: 'usr-officer-01',
    name: 'Dr. Sunita Mehra',
    email: 'officer@aicte-india.org',
    salt: officerHash.salt,
    passwordHash: officerHash.hash,
    role: 'Regulatory Director',
    designation: 'Senior Regulatory Compliance Director',
    institution: 'AICTE Directorate of Institutional Approvals',
    avatar: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=150&auto=format&fit=crop&q=80',
    createdAt: new Date().toISOString(),
  };

  const user2: StoredUser = {
    id: 'usr-auditor-02',
    name: 'Prof. Arvind Swaminathan',
    email: 'reviewer@apex-edu.in',
    salt: reviewerHash.salt,
    passwordHash: reviewerHash.hash,
    role: 'Senior Auditor',
    designation: 'Lead Scrutiny Auditor',
    institution: 'Apex Institute of Technology & Sciences',
    avatar: 'https://images.unsplash.com/photo-1560250097-0b93528c311a?w=150&auto=format&fit=crop&q=80',
    createdAt: new Date().toISOString(),
  };

  db.users[user1.email.toLowerCase()] = user1;
  db.users[user2.email.toLowerCase()] = user2;

  saveDbToDisk();
}

// Initialize on module load
loadDbFromDisk();

export const authRouter = Router();

// Sanitizer helper for client response
function sanitizeUser(u: StoredUser) {
  const { salt, passwordHash, ...safe } = u;
  return safe;
}

// 1. SIGN UP / REGISTER
authRouter.post(['/signup', '/register'], (req: Request, res: Response) => {
  try {
    const rawName = req.body.name || req.body.fullName;
    const { email, password, role, institution } = req.body;

    if (!rawName || typeof rawName !== 'string' || rawName.trim().length < 2) {
      return res.status(400).json({ success: false, error: 'Full name is required (minimum 2 characters).' });
    }

    if (!email || typeof email !== 'string' || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      return res.status(400).json({ success: false, error: 'A valid email address is required.' });
    }

    if (!password || typeof password !== 'string') {
      return res.status(400).json({ success: false, error: 'Password is required.' });
    }

    // Password validation: at least 8 chars, 1 uppercase, 1 number
    if (password.length < 8) {
      return res.status(400).json({ success: false, error: 'Password must be at least 8 characters in length.' });
    }
    if (!/[A-Z]/.test(password)) {
      return res.status(400).json({ success: false, error: 'Password must include at least one uppercase letter (A-Z).' });
    }
    if (!/[0-9]/.test(password)) {
      return res.status(400).json({ success: false, error: 'Password must include at least one numerical digit (0-9).' });
    }

    const emailKey = email.trim().toLowerCase();

    // Check duplicate account
    if (db.users[emailKey]) {
      return res.status(409).json({ success: false, error: 'An account with this email address already exists. Please log in.' });
    }

    const { salt, hash } = hashPassword(password);
    const userId = 'usr-' + Date.now() + '-' + crypto.randomBytes(3).toString('hex');

    const newUser: StoredUser = {
      id: userId,
      name: rawName.trim(),
      email: emailKey,
      salt,
      passwordHash: hash,
      role: (role as any) || 'Scrutiny Officer',
      designation: role === 'Institutional Representative' ? 'Institutional Nodal Officer' : 'Regulatory Scrutiny Auditor',
      institution: institution ? institution.trim() : 'AICTE Regulatory Council',
      createdAt: new Date().toISOString(),
    };

    db.users[emailKey] = newUser;

    // Issue session token (7 days)
    const token = generateSecureToken();
    const expiresAt = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString();

    db.sessions[token] = {
      token,
      userId: newUser.id,
      createdAt: new Date().toISOString(),
      expiresAt,
    };

    saveDbToDisk();

    return res.status(201).json({
      success: true,
      message: 'Account successfully registered.',
      token,
      user: sanitizeUser(newUser),
    });
  } catch (err: any) {
    console.error('Signup error:', err);
    return res.status(500).json({ success: false, error: 'Failed to process account registration.' });
  }
});

// 2. LOGIN
authRouter.post('/login', (req: Request, res: Response) => {
  try {
    const { email, password, rememberMe } = req.body;

    if (!email || !password) {
      return res.status(400).json({ error: 'Please enter both your email address and password.' });
    }

    const emailKey = email.trim().toLowerCase();
    const user = db.users[emailKey];

    if (!user) {
      return res.status(401).json({ error: 'Invalid email address or password. Please verify your credentials.' });
    }

    const isValid = verifyPassword(password, user.salt, user.passwordHash);
    if (!isValid) {
      return res.status(401).json({ error: 'Invalid email address or password. Please verify your credentials.' });
    }

    // Session duration: 30 days if rememberMe, else 7 days
    const durationDays = rememberMe ? 30 : 7;
    const token = generateSecureToken();
    const expiresAt = new Date(Date.now() + durationDays * 24 * 60 * 60 * 1000).toISOString();

    db.sessions[token] = {
      token,
      userId: user.id,
      createdAt: new Date().toISOString(),
      expiresAt,
    };

    saveDbToDisk();

    return res.json({
      success: true,
      message: 'Authentication successful.',
      token,
      user: sanitizeUser(user),
    });
  } catch (err: any) {
    console.error('Login error:', err);
    return res.status(500).json({ success: false, error: 'Authentication failed due to a server error.' });
  }
});

// 3. CURRENT USER (SESSION VERIFICATION)
authRouter.get('/me', (req: Request, res: Response) => {
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.status(401).json({ success: false, error: 'No authorization token provided.' });
    }

    const token = authHeader.substring(7).trim();
    const session = db.sessions[token];

    if (!session) {
      return res.status(401).json({ success: false, error: 'Invalid or expired session token. Please log in again.' });
    }

    // Check expiration
    if (new Date(session.expiresAt) < new Date()) {
      delete db.sessions[token];
      saveDbToDisk();
      return res.status(401).json({ success: false, error: 'Session expired. Please log in again.' });
    }

    // Find user by session.userId
    const user = Object.values(db.users).find((u) => u.id === session.userId);
    if (!user) {
      delete db.sessions[token];
      saveDbToDisk();
      return res.status(401).json({ success: false, error: 'User account no longer exists.' });
    }

    return res.json({
      success: true,
      authenticated: true,
      user: sanitizeUser(user),
    });
  } catch (err: any) {
    console.error('Get me error:', err);
    return res.status(500).json({ success: false, error: 'Failed to verify session.' });
  }
});

// 4. LOGOUT
authRouter.post('/logout', (req: Request, res: Response) => {
  try {
    const authHeader = req.headers.authorization;
    if (authHeader && authHeader.startsWith('Bearer ')) {
      const token = authHeader.substring(7).trim();
      if (db.sessions[token]) {
        delete db.sessions[token];
        saveDbToDisk();
      }
    }
    return res.json({ success: true, message: 'Successfully signed out of AICTE VerifyAI.' });
  } catch (err: any) {
    return res.status(500).json({ success: false, error: 'Logout failed.' });
  }
});

// 5. FORGOT PASSWORD
authRouter.post('/forgot-password', (req: Request, res: Response) => {
  try {
    const { email } = req.body;
    if (!email || typeof email !== 'string') {
      return res.status(400).json({ success: false, error: 'Please enter a valid email address.' });
    }

    const emailKey = email.trim().toLowerCase();
    const user = db.users[emailKey];

    if (!user) {
      // For security, don't leak user existence directly, but for sandbox/preview convenience give actionable feedback
      return res.status(404).json({ success: false, error: 'No account registered with this email address.' });
    }

    // Generate 1-hour reset token
    const resetToken = crypto.randomBytes(24).toString('hex');
    const expiresAt = new Date(Date.now() + 60 * 60 * 1000).toISOString();

    db.resetTokens[resetToken] = {
      token: resetToken,
      email: emailKey,
      expiresAt,
    };

    saveDbToDisk();

    return res.json({
      success: true,
      message: 'Password reset authorization token generated.',
      resetToken,
      expiresAt,
    });
  } catch (err: any) {
    console.error('Forgot password error:', err);
    return res.status(500).json({ success: false, error: 'Failed to initiate password reset.' });
  }
});

// 6. RESET PASSWORD
authRouter.post('/reset-password', (req: Request, res: Response) => {
  try {
    const { token, newPassword } = req.body;

    if (!token || typeof token !== 'string') {
      return res.status(400).json({ success: false, error: 'Password reset token is required.' });
    }

    if (!newPassword || typeof newPassword !== 'string' || newPassword.length < 8) {
      return res.status(400).json({ success: false, error: 'New password must be at least 8 characters in length.' });
    }
    if (!/[A-Z]/.test(newPassword)) {
      return res.status(400).json({ success: false, error: 'New password must include at least one uppercase letter.' });
    }
    if (!/[0-9]/.test(newPassword)) {
      return res.status(400).json({ success: false, error: 'New password must include at least one number.' });
    }

    const resetEntry = db.resetTokens[token.trim()];
    if (!resetEntry) {
      return res.status(400).json({ success: false, error: 'Invalid or already used password reset token.' });
    }

    if (new Date(resetEntry.expiresAt) < new Date()) {
      delete db.resetTokens[token.trim()];
      saveDbToDisk();
      return res.status(400).json({ success: false, error: 'Password reset token has expired. Please request a new one.' });
    }

    const user = db.users[resetEntry.email];
    if (!user) {
      delete db.resetTokens[token.trim()];
      saveDbToDisk();
      return res.status(404).json({ success: false, error: 'Associated user account was not found.' });
    }

    // Update with fresh salt & hash
    const { salt, hash } = hashPassword(newPassword);
    user.salt = salt;
    user.passwordHash = hash;

    // Invalidate reset token and any existing sessions for security
    delete db.resetTokens[token.trim()];
    Object.keys(db.sessions).forEach((sToken) => {
      if (db.sessions[sToken].userId === user.id) {
        delete db.sessions[sToken];
      }
    });

    saveDbToDisk();

    return res.json({
      success: true,
      message: 'Password successfully updated. You may now sign in with your new credentials.',
    });
  } catch (err: any) {
    console.error('Reset password error:', err);
    return res.status(500).json({ success: false, error: 'Failed to reset password.' });
  }
});
