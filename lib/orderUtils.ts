import crypto from 'crypto';

// Configuration
const PLATFORM_PREFIX = 'SHD';
const HMAC_SECRET = process.env.REF_HMAC_SECRET || 'your-secure-hmac-secret-change-in-production';
const REF_VERSION = 'V1';
const REF_SIG_LEN = 6;
const REF_TOKEN_RANDOM = 5;
const COMMISSION_RATE = 0.15; // 15% platform commission

// Helper functions
function base36Encode(num: number): string {
  return num.toString(36);
}

function randomBase36(len: number = REF_TOKEN_RANDOM): string {
  const max = Math.pow(36, len) - 1;
  const rnd = Math.floor(Math.random() * (max + 1));
  return base36Encode(rnd).padStart(len, '0');
}

function hmacHex(msg: string): string {
  return crypto.createHmac('sha256', HMAC_SECRET).update(msg).digest('hex');
}

export function makeToken(): string {
  const ts36 = base36Encode(Date.now());
  const rand = randomBase36(REF_TOKEN_RANDOM);
  return `${ts36}${rand}`;
}

export function generateRef(token: string): string {
  const sigFull = hmacHex(`${token}:${REF_VERSION}`);
  const sig = sigFull.slice(0, REF_SIG_LEN);
  return `${PLATFORM_PREFIX}-${token}-${REF_VERSION}-${sig}`;
}

export function decodeRef(ref: string): { ok: boolean; reason?: string; token?: string } {
  const parts = ref.split('-');
  if (parts.length < 4) return { ok: false, reason: 'bad_format' };
  
  const [prefix, token, version, sig] = parts;
  if (prefix !== PLATFORM_PREFIX) return { ok: false, reason: 'bad_prefix' };
  if (version !== REF_VERSION) return { ok: false, reason: 'bad_version' };
  
  const expected = hmacHex(`${token}:${version}`).slice(0, REF_SIG_LEN);
  if (!crypto.timingSafeEqual(Buffer.from(expected), Buffer.from(sig))) {
    return { ok: false, reason: 'bad_signature' };
  }
  
  return { ok: true, token };
}

export function calculateCommission(amount: number): { commission: number; netAmount: number } {
  const commission = Math.round(amount * COMMISSION_RATE);
  const netAmount = amount - commission;
  return { commission, netAmount };
}

export function generateOrderId(): string {
  const date = new Date();
  const year = date.getFullYear().toString().slice(-2);
  const month = (date.getMonth() + 1).toString().padStart(2, '0');
  const day = date.getDate().toString().padStart(2, '0');
  const random = Math.random().toString(36).substring(2, 8).toUpperCase();
  return `ORD-${year}${month}${day}-${random}`;
}