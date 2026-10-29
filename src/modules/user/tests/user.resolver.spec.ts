import { jest } from '@jest/globals';
import { UserResolver } from '../resolvers/user.resolver';
import type { UserService } from '../user.service';

describe('UserResolver', () => {
  let resolver: UserResolver;
  const service = {
    getById: jest.fn<(...args: any[]) => any>(),
    updateProfile: jest.fn<(...args: any[]) => any>(),
    findAll: jest.fn<(...args: any[]) => any>(),
    delete: jest.fn<(...args: any[]) => any>(),
  };
  const currentUser = { id: 7 } as any;
  const date = new Date();
  const user = {
    id: 7,
    email: 'a@b.c',
    username: 'u',
    avatarUrl: null,
    coins: 5,
    createdAt: date,
    passwordHash: 'secret',
  };
  const publicUser = {
    id: 7,
    username: 'u',
    avatarUrl: null,
    coins: 5,
    createdAt: date,
  };

  beforeEach(() => {
    jest.resetAllMocks();
    resolver = new UserResolver(service as unknown as UserService);
  });

  it('myProfile returns the profile without sensitive fields', async () => {
    service.getById.mockResolvedValue(user);

    await expect(resolver.myProfile(currentUser)).resolves.toEqual({
      ...publicUser,
      email: 'a@b.c',
    });
    expect(service.getById).toHaveBeenCalledWith(7);
  });

  it('updateMyProfile updates and maps the profile', async () => {
    const input = { username: 'u' } as any;
    service.updateProfile.mockResolvedValue(user);

    await expect(resolver.updateMyProfile(currentUser, input)).resolves.toEqual({
      ...publicUser,
      email: 'a@b.c',
    });
    expect(service.updateProfile).toHaveBeenCalledWith(7, input);
  });

  it('listUsers maps to public users', async () => {
    service.findAll.mockResolvedValue([user]);

    await expect(resolver.listUsers(10, 2)).resolves.toEqual([publicUser]);
    expect(service.findAll).toHaveBeenCalledWith(10, 2);
  });

  it('getUser maps to a public user', async () => {
    service.getById.mockResolvedValue(user);

    await expect(resolver.getUser(7)).resolves.toEqual(publicUser);
    expect(service.getById).toHaveBeenCalledWith(7);
  });

  it('deleteMyAccount deletes the current user', async () => {
    service.delete.mockResolvedValue(undefined);

    await expect(resolver.deleteMyAccount(currentUser)).resolves.toBe(true);
    expect(service.delete).toHaveBeenCalledWith(7);
  });
});
