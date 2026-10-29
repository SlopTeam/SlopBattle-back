import { jest } from '@jest/globals';
import { UnauthorizedException } from '@nestjs/common';
import { AdminJwtStrategy } from '../strategies/admin-jwt.strategy';

describe('AdminJwtStrategy', () => {
  let strategy: AdminJwtStrategy;
  const admins = { findById: jest.fn<(...args: any[]) => any>() };
  const config = { getOrThrow: () => 'test-secret' };

  beforeEach(() => {
    jest.resetAllMocks();
    strategy = new AdminJwtStrategy(config as any, admins as any);
  });

  it('returns the admin behind the token', async () => {
    admins.findById.mockResolvedValue({ id: 2, email: 'a@b.c' });
    await expect(strategy.validate({ sub: 2 })).resolves.toEqual({
      id: 2,
      email: 'a@b.c',
      isAdmin: true,
    });
  });

  it('rejects a token whose admin no longer exists', async () => {
    admins.findById.mockResolvedValue(null);
    await expect(strategy.validate({ sub: 2 })).rejects.toBeInstanceOf(
      UnauthorizedException,
    );
  });

  it('rejects a malformed subject', async () => {
    await expect(strategy.validate({ sub: 'x' as any })).rejects.toBeInstanceOf(
      UnauthorizedException,
    );
    expect(admins.findById).not.toHaveBeenCalled();
  });
});
