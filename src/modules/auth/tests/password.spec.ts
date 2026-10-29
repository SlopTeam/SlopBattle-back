import { hashPassword, verifyPassword } from '../password';

describe('password', () => {
  it('hashes with scrypt and a random salt', async () => {
    const first = await hashPassword('secret123');
    const second = await hashPassword('secret123');

    expect(first).toMatch(/^scrypt\$[\da-f]{32}\$[\da-f]{128}$/);
    expect(first).not.toBe(second);
  });

  it('verifies the right password only', async () => {
    const hash = await hashPassword('secret123');
    await expect(verifyPassword('secret123', hash)).resolves.toBe(true);
    await expect(verifyPassword('secret124', hash)).resolves.toBe(false);
  });

  it.each(['bcrypt$aa$bb', 'scrypt$zz$yy', 'scrypt$aa$bb', 'garbage', ''])(
    'rejects a malformed hash (%s)',
    async (stored) => {
      await expect(verifyPassword('pw', stored)).resolves.toBe(false);
    },
  );
});
