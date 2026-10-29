import { jest } from '@jest/globals';
import { ConflictException, UnauthorizedException } from '@nestjs/common';
import { AuthService } from '../auth.service';

describe('AuthService', () => {
  let service: AuthService;
  const users = {
    findByEmail: jest.fn<(...args: any[]) => any>(),
    findByGoogleId: jest.fn<(...args: any[]) => any>(),
    create: jest.fn<(...args: any[]) => any>(),
    update: jest.fn<(...args: any[]) => any>(),
  };
  const jwt = { signAsync: jest.fn<(...args: any[]) => any>() };

  beforeEach(() => {
    jest.resetAllMocks();
    service = new AuthService(users as any, jwt as any);
    users.create.mockImplementation(async (data) => ({ id: 1, ...(data as object) }));
  });

  describe('register', () => {
    it('normalizes the email and stores a scrypt hash', async () => {
      users.findByEmail.mockResolvedValue(null);

      await service.register('  A@B.C ', 'pw');

      expect(users.findByEmail).toHaveBeenCalledWith('a@b.c');
      const arg = users.create.mock.calls[0][0] as any;
      expect(arg.email).toBe('a@b.c');
      expect(arg.passwordHash).toMatch(/^scrypt\$[\da-f]{32}\$[\da-f]{128}$/);
      expect(arg.passwordHash).not.toContain('pw');
    });

    it('rejects an email already in use', async () => {
      users.findByEmail.mockResolvedValue({ id: 2 });
      await expect(service.register('a@b.c', 'pw')).rejects.toBeInstanceOf(
        ConflictException,
      );
      expect(users.create).not.toHaveBeenCalled();
    });
  });

  describe('validateLocal', () => {
    async function hashed(password: string) {
      users.findByEmail.mockResolvedValue(null);
      const user: any = await service.register('a@b.c', password);
      return user;
    }

    it('returns the user for a correct password', async () => {
      const user = await hashed('pw');
      users.findByEmail.mockResolvedValue(user);

      await expect(service.validateLocal(' A@B.C', 'pw')).resolves.toBe(user);
      expect(users.findByEmail).toHaveBeenLastCalledWith('a@b.c');
    });

    it('rejects a wrong password', async () => {
      const user = await hashed('pw');
      users.findByEmail.mockResolvedValue(user);
      await expect(service.validateLocal('a@b.c', 'bad')).rejects.toBeInstanceOf(
        UnauthorizedException,
      );
    });

    it('rejects an unknown user', async () => {
      users.findByEmail.mockResolvedValue(null);
      await expect(service.validateLocal('a@b.c', 'pw')).rejects.toBeInstanceOf(
        UnauthorizedException,
      );
    });

    it('rejects a user without password (google only)', async () => {
      users.findByEmail.mockResolvedValue({ id: 1, passwordHash: null });
      await expect(service.validateLocal('a@b.c', 'pw')).rejects.toBeInstanceOf(
        UnauthorizedException,
      );
    });

    it.each(['bcrypt$aa$bb', 'scrypt$zz$yy', 'scrypt$aa$bb', 'garbage'])(
      'rejects a malformed hash (%s)',
      async (passwordHash) => {
        users.findByEmail.mockResolvedValue({ id: 1, passwordHash });
        await expect(service.validateLocal('a@b.c', 'pw')).rejects.toBeInstanceOf(
          UnauthorizedException,
        );
      },
    );
  });

  describe('validateGoogle', () => {
    const profile = {
      id: 'g1',
      emails: [{ value: 'A@B.C', verified: true }],
    };

    it('rejects a profile without verified email', async () => {
      await expect(
        service.validateGoogle({ id: 'g1', emails: [{ value: 'a@b.c' }] }),
      ).rejects.toBeInstanceOf(UnauthorizedException);
      await expect(service.validateGoogle({ id: 'g1' })).rejects.toBeInstanceOf(
        UnauthorizedException,
      );
    });

    it('returns the user already linked to the google id', async () => {
      const user = { id: 1 };
      users.findByGoogleId.mockResolvedValue(user);
      await expect(service.validateGoogle(profile)).resolves.toBe(user);
      expect(users.create).not.toHaveBeenCalled();
    });

    it('links the google id to an existing email account', async () => {
      const existing = { id: 1, googleId: null };
      users.findByGoogleId.mockResolvedValue(null);
      users.findByEmail.mockResolvedValue(existing);
      users.update.mockResolvedValue({ id: 1, googleId: 'g1' });

      await service.validateGoogle(profile);

      expect(users.findByEmail).toHaveBeenCalledWith('a@b.c');
      expect(users.update).toHaveBeenCalledWith(1, { googleId: 'g1' });
    });

    it('rejects an email linked to another google account', async () => {
      users.findByGoogleId.mockResolvedValue(null);
      users.findByEmail.mockResolvedValue({ id: 1, googleId: 'other' });
      await expect(service.validateGoogle(profile)).rejects.toBeInstanceOf(
        ConflictException,
      );
      expect(users.update).not.toHaveBeenCalled();
    });

    it('creates a new user otherwise', async () => {
      users.findByGoogleId.mockResolvedValue(null);
      users.findByEmail.mockResolvedValue(null);

      await service.validateGoogle(profile);

      expect(users.create).toHaveBeenCalledWith({
        email: 'a@b.c',
        googleId: 'g1',
      });
    });
  });

  describe('login', () => {
    it('signs a token with the user id as subject', async () => {
      jwt.signAsync.mockResolvedValue('token');

      await expect(service.login({ id: 4 } as any)).resolves.toEqual({
        access_token: 'token',
      });
      expect(jwt.signAsync).toHaveBeenCalledWith({ sub: 4 });
    });
  });
});
