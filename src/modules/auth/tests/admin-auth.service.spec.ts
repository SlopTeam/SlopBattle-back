import { jest } from '@jest/globals';
import { UnauthorizedException } from '@nestjs/common';
import { AdminAuthService } from '../admin-auth.service';
import { ADMIN_JWT_AUDIENCE } from '../auth.constants';
import { hashPassword } from '../password';

describe('AdminAuthService', () => {
  let service: AdminAuthService;
  const admins = { findByEmail: jest.fn<(...args: any[]) => any>() };
  const jwt = { signAsync: jest.fn<(...args: any[]) => any>() };

  beforeEach(() => {
    jest.resetAllMocks();
    service = new AdminAuthService(admins as any, jwt as any);
  });

  it('validates an admin with the right password', async () => {
    const admin = {
      id: 1,
      email: 'a@b.c',
      passwordHash: await hashPassword('secret123'),
    };
    admins.findByEmail.mockResolvedValue(admin);

    await expect(service.validate('a@b.c', 'secret123')).resolves.toBe(admin);
  });

  it('rejects a wrong password', async () => {
    admins.findByEmail.mockResolvedValue({
      id: 1,
      passwordHash: await hashPassword('secret123'),
    });
    await expect(service.validate('a@b.c', 'nope')).rejects.toBeInstanceOf(
      UnauthorizedException,
    );
  });

  it('rejects an unknown admin', async () => {
    admins.findByEmail.mockResolvedValue(null);
    await expect(service.validate('x@y.z', 'pw')).rejects.toBeInstanceOf(
      UnauthorizedException,
    );
  });

  it('signs a token for the back-office audience only', async () => {
    jwt.signAsync.mockResolvedValue('t');

    await expect(service.login({ id: 7 } as any)).resolves.toEqual({
      access_token: 't',
    });
    expect(jwt.signAsync).toHaveBeenCalledWith(
      { sub: 7 },
      expect.objectContaining({ audience: ADMIN_JWT_AUDIENCE }),
    );
  });
});
