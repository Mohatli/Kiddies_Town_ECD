import bcrypt from 'bcryptjs';

/**
 * Single source of truth for password hashing policy.
 * Kept free of express/jwt imports so config/db/bootstrap layers can use it
 * without circular dependencies.
 */
const SALT_ROUNDS = 12;

export function hashPasswordSync(plain: string): string {
  return bcrypt.hashSync(plain, SALT_ROUNDS);
}

export async function hashPassword(plain: string): Promise<string> {
  return bcrypt.hash(plain, SALT_ROUNDS);
}

export function isBcryptHash(value: unknown): value is string {
  return typeof value === 'string' && value.startsWith('$2');
}

export async function comparePassword(plain: string, hash: string): Promise<boolean> {
  return bcrypt.compare(plain, hash);
}
