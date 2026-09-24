import crypto from 'crypto';
import fs from 'fs';
import path from 'path';

export const DEFAULT_ADMIN_EMAIL = 'admin@jobforalgerians.dz';
export const DEFAULT_ADMIN_PASSWORD = 'admin123456';

const DATA_DIR = path.join(process.cwd(), 'data');
const CREDS_FILE = path.join(DATA_DIR, 'admin-credentials.json');
const AUTH_SECRET = process.env.SUPABASE_SERVICE_ROLE_KEY || 'job-for-algerians-secure-admin-secret-2026';

export function hashPassword(password) {
  const salt = crypto.randomBytes(16).toString('hex');
  const hash = crypto.pbkdf2Sync(password, salt, 100000, 64, 'sha512').toString('hex');
  return `${salt}:${hash}`;
}

export function verifyPassword(password, storedHash) {
  if (!storedHash || !storedHash.includes(':')) return false;
  const [salt, originalHash] = storedHash.split(':');
  const hash = crypto.pbkdf2Sync(password, salt, 100000, 64, 'sha512').toString('hex');
  return crypto.timingSafeEqual(Buffer.from(hash, 'hex'), Buffer.from(originalHash, 'hex'));
}

export function createAdminToken(email) {
  const payload = {
    email,
    iat: Date.now(),
    exp: Date.now() + 7 * 24 * 60 * 60 * 1000, // 7 days
  };
  const data = Buffer.from(JSON.stringify(payload)).toString('base64url');
  const sig = crypto.createHmac('sha256', AUTH_SECRET).update(data).digest('base64url');
  return `${data}.${sig}`;
}

export function verifyAdminToken(token) {
  if (!token || typeof token !== 'string') return null;
  const parts = token.split('.');
  if (parts.length !== 2) return null;
  const [data, sig] = parts;
  const expectedSig = crypto.createHmac('sha256', AUTH_SECRET).update(data).digest('base64url');
  if (sig !== expectedSig) return null;
  try {
    const payload = JSON.parse(Buffer.from(data, 'base64url').toString('utf8'));
    if (Date.now() > payload.exp) return null;
    return payload;
  } catch (e) {
    return null;
  }
}

// Read admin credentials from Supabase DB or local fallback file
export async function getAdminCredentials(supabaseClient) {
  // 1. Try reading from Supabase DB table
  if (supabaseClient) {
    try {
      const { data, error } = await supabaseClient
        .from('admin_credentials')
        .select('*')
        .eq('id', 1)
        .maybeSingle();

      if (!error && data && data.email && data.password_hash) {
        return {
          email: data.email,
          password_hash: data.password_hash,
          updated_at: data.updated_at,
        };
      }
    } catch (e) {
      // DB table may not exist yet; continue to file fallback
    }
  }

  // 2. Try reading from local data file
  try {
    if (fs.existsSync(CREDS_FILE)) {
      const raw = fs.readFileSync(CREDS_FILE, 'utf8');
      const parsed = JSON.parse(raw);
      if (parsed && parsed.email && parsed.password_hash) {
        return parsed;
      }
    }
  } catch (e) {}

  // 3. Fallback to standard default credentials
  return {
    email: DEFAULT_ADMIN_EMAIL,
    password_hash: hashPassword(DEFAULT_ADMIN_PASSWORD),
    updated_at: new Date().toISOString(),
  };
}

// Update admin credentials in Supabase DB and backup file
export async function saveAdminCredentials(newEmail, newPassword, supabaseClient) {
  const newHash = hashPassword(newPassword);
  const now = new Date().toISOString();

  // 1. Save to Supabase DB
  if (supabaseClient) {
    try {
      await supabaseClient.from('admin_credentials').upsert({
        id: 1,
        email: newEmail,
        password_hash: newHash,
        updated_at: now,
      });
    } catch (e) {
      console.warn('Could not save admin credentials to Supabase table:', e.message);
    }
  }

  // 2. Save to local fallback file
  try {
    if (!fs.existsSync(DATA_DIR)) {
      fs.mkdirSync(DATA_DIR, { recursive: true });
    }
    fs.writeFileSync(
      CREDS_FILE,
      JSON.stringify({ email: newEmail, password_hash: newHash, updated_at: now }, null, 2),
      'utf8'
    );
  } catch (e) {
    console.warn('Could not save credentials to local file:', e.message);
  }

  return { email: newEmail, password_hash: newHash, updated_at: now };
}
