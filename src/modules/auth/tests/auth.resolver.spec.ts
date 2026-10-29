import { jest } from '@jest/globals';
import { AuthResolver } from '../resolvers/auth.resolver';
import type { AuthService } from '../auth.service';

describe('AuthResolver', () => {
  let resolver: AuthResolver;
  const service = {
    register: jest.fn<(...args: any[]) => any>(),
    validateLocal: jest.fn<(...args: any[]) => any>(),
    login: jest.fn<(...args: any[]) => any>(),
  };
  const user = { id: 1, email: 'a@b.c' };

  beforeEach(() => {
    jest.resetAllMocks();
    resolver = new AuthResolver(service as unknown as AuthService);
  });

  it('register creates the user then logs in', async () => {
    service.register.mockResolvedValue(user);
    service.login.mockResolvedValue({ access_token: 't' });

    await expect(
      resolver.register({ email: 'a@b.c', password: 'pw' } as any),
    ).resolves.toEqual({ access_token: 't' });
    expect(service.register).toHaveBeenCalledWith('a@b.c', 'pw');
    expect(service.login).toHaveBeenCalledWith(user);
  });

  it('login validates credentials then signs a token', async () => {
    service.validateLocal.mockResolvedValue(user);
    service.login.mockResolvedValue({ access_token: 't' });

    await expect(
      resolver.login({ email: 'a@b.c', password: 'pw' } as any),
    ).resolves.toEqual({ access_token: 't' });
    expect(service.validateLocal).toHaveBeenCalledWith('a@b.c', 'pw');
  });

  it('login propagates invalid credentials', async () => {
    service.validateLocal.mockRejectedValue(new Error('invalid'));
    await expect(
      resolver.login({ email: 'a@b.c', password: 'x' } as any),
    ).rejects.toThrow('invalid');
    expect(service.login).not.toHaveBeenCalled();
  });

  it('me returns the current user', () => {
    expect(resolver.me(user)).toBe(user);
  });
});
