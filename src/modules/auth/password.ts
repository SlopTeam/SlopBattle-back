import {
  randomBytes,
  scrypt as scryptCallback,
  timingSafeEqual,
} from 'node:crypto';

// Shared by player and admin accounts: `scrypt$<salt hex>$<hash hex>`.

function deriveKey(password: string, salt: Buffer): Promise<Buffer> {
  return new Promise((resolve, reject) => {
    scryptCallback(password, salt, 64, (error, key) => {
      if (error) {
        reject(error);
      } else {
        resolve(key);
      }
    });
  });
}

export async function hashPassword(password: string): Promise<string> {
  const salt = randomBytes(16);
  const hash = await deriveKey(password, salt);
  return `scrypt$${salt.toString('hex')}$${hash.toString('hex')}`;
}

export async function verifyPassword(
  password: string,
  storedHash: string,
): Promise<boolean> {
  const [algorithm, saltHex, hashHex] = storedHash.split('$');
  if (
    algorithm !== 'scrypt' ||
    !saltHex ||
    !hashHex ||
    !/^[\da-f]+$/i.test(saltHex) ||
    !/^[\da-f]+$/i.test(hashHex)
  ) {
    return false;
  }

  const salt = Buffer.from(saltHex, 'hex');
  const expectedHash = Buffer.from(hashHex, 'hex');
  if (salt.length !== 16 || expectedHash.length !== 64) return false;

  const actualHash = await deriveKey(password, salt);
  return timingSafeEqual(actualHash, expectedHash);
}
