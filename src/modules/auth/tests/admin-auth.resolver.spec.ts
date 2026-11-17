import { jest } from '@jest/globals';
import { AdminAuthResolver } from '../resolvers/admin-auth.resolver';
import type { AdminAuthService } from '../admin-auth.service';

describe('AdminAuthResolver', () => {
  let resolver: AdminAuthResolver;
  const service = {
    validate: jest.fn<(...args: any[]) => any>(),
    login: jest.fn<(...args: any[]) => any>(),
  };

  beforeEach(() => {
    jest.resetAllMocks();
    resolver = new AdminAuthResolver(service as unknown as AdminAuthService);
  });

  it('adminLogin validates credentials then signs a token', async () => {
    const admin = { id: 1, email: 'a@b.c' };
    service.validate.mockResolvedValue(admin);
    service.login.mockResolvedValue({ access_token: 't' });

    await expect(
      resolver.adminLogin({ email: 'a@b.c', password: 'pw' } as any),
    ).resolves.toEqual({ access_token: 't' });
    expect(service.validate).toHaveBeenCalledWith('a@b.c', 'pw');
    expect(service.login).toHaveBeenCalledWith(admin);
  });

  it('adminLogin propagates invalid credentials', async () => {
    service.validate.mockRejectedValue(new Error('invalid'));
    await expect(
      resolver.adminLogin({ email: 'a@b.c', password: 'x' } as any),
    ).rejects.toThrow('invalid');
    expect(service.login).not.toHaveBeenCalled();
  });

  it('adminMe returns the current admin', () => {
    expect(resolver.adminMe({ id: 1, email: 'a@b.c', isAdmin: true })).toEqual({
      id: 1,
      email: 'a@b.c',
    });
  });
});
