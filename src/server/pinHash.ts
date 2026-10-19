import crypto from 'crypto';

const SALT_LENGTH = 16;
const HASH_LENGTH = 64;
const ITERATIONS = 100000;
const DIGEST = 'sha512';

/**
 * Hash a PIN or password using PBKDF2 with a random salt.
 * Returns a combined string: salt:hash (both hex-encoded).
 */
export function hashPin(pin: string): string {
  const salt = crypto.randomBytes(SALT_LENGTH).toString('hex');
  const hash = crypto.pbkdf2Sync(pin, salt, ITERATIONS, HASH_LENGTH, DIGEST).toString('hex');
  return `${salt}:${hash}`;
}

/**
 * Verify a PIN against a stored hash (salt:hash format).
 */
export function verifyPin(pin: string, storedHash: string): boolean {
  if (!storedHash.includes(':')) {
    // Legacy plaintext comparison (for backward compatibility with seed data)
    return pin === storedHash;
  }
  const [salt, hash] = storedHash.split(':');
  const testHash = crypto.pbkdf2Sync(pin, salt, ITERATIONS, HASH_LENGTH, DIGEST).toString('hex');
  return hash === testHash;
}

/**
 * Generate a random 4-digit PIN.
 */
export function generateRandomPin(): string {
  return crypto.randomInt(1000, 9999).toString();
}
