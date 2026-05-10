import crypto from 'node:crypto';

const keyLength = 64;

export function hashPassword(password) {
  const passwordSalt = crypto.randomBytes(16).toString('hex');
  const passwordHash = crypto.scryptSync(password, passwordSalt, keyLength).toString('hex');
  return { passwordHash, passwordSalt };
}

export function verifyPassword(password, passwordHash, passwordSalt) {
  const attemptedHash = crypto.scryptSync(password, passwordSalt, keyLength);
  const storedHash = Buffer.from(passwordHash, 'hex');
  return storedHash.length === attemptedHash.length && crypto.timingSafeEqual(storedHash, attemptedHash);
}
