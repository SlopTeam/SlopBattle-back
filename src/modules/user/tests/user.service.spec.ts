import { jest } from '@jest/globals';
import {
  BadRequestException,
  ConflictException,
  NotFoundException,
} from '@nestjs/common';
import { UserService } from '../user.service';

describe('UserService', () => {
  let service: UserService;
  const repo = {
    find: jest.fn<(...args: any[]) => any>(),
    findOne: jest.fn<(...args: any[]) => any>(),
    findOneOrFail: jest.fn<(...args: any[]) => any>(),
    create: jest.fn<(...args: any[]) => any>(),
    assign: jest.fn<(...args: any[]) => any>(),
  };
  const em = {
    flush: jest.fn<(...args: any[]) => any>(),
    remove: jest.fn<(...args: any[]) => any>(),
  };

  beforeEach(() => {
    jest.resetAllMocks();
    service = new UserService(repo as any, em as any);
  });

  it('finds users by email, google id and id', async () => {
    repo.findOne.mockResolvedValue({ id: 1 });
    await service.findByEmail('a@b.c');
    await service.findByGoogleId('g');
    await service.findById(1);
    expect(repo.findOne).toHaveBeenNthCalledWith(1, { email: 'a@b.c' });
    expect(repo.findOne).toHaveBeenNthCalledWith(2, { googleId: 'g' });
    expect(repo.findOne).toHaveBeenNthCalledWith(3, { id: 1 });
  });

  describe('findAll', () => {
    it('uses default pagination', async () => {
      repo.find.mockResolvedValue([]);
      await service.findAll();
      expect(repo.find).toHaveBeenCalledWith(
        {},
        { orderBy: { id: 'asc' }, limit: 20, offset: 0 },
      );
    });

    it('clamps limit and offset', async () => {
      repo.find.mockResolvedValue([]);
      await service.findAll(1000, -5);
      expect(repo.find).toHaveBeenCalledWith(
        {},
        { orderBy: { id: 'asc' }, limit: 100, offset: 0 },
      );
      await service.findAll(0, 3);
      expect(repo.find).toHaveBeenLastCalledWith(
        {},
        { orderBy: { id: 'asc' }, limit: 1, offset: 3 },
      );
    });
  });

  describe('getById', () => {
    it('returns the user', async () => {
      repo.findOne.mockResolvedValue({ id: 1 });
      await expect(service.getById(1)).resolves.toEqual({ id: 1 });
    });

    it('throws when missing', async () => {
      repo.findOne.mockResolvedValue(null);
      await expect(service.getById(1)).rejects.toBeInstanceOf(NotFoundException);
    });
  });

  describe('create', () => {
    it('rejects without password or google id', async () => {
      await expect(service.create({ email: 'a@b.c' })).rejects.toBeInstanceOf(
        BadRequestException,
      );
      expect(repo.create).not.toHaveBeenCalled();
    });

    it('creates a user with defaults', async () => {
      const created = { id: 1 };
      repo.create.mockReturnValue(created);

      const result = await service.create({ email: 'a@b.c', passwordHash: 'h' });

      expect(repo.create).toHaveBeenCalledWith({
        email: 'a@b.c',
        passwordHash: 'h',
        googleId: null,
        coins: 0,
        createdAt: expect.any(Date),
      });
      expect(em.flush).toHaveBeenCalledTimes(1);
      expect(result).toBe(created);
    });
  });

  describe('update', () => {
    it('assigns data and flushes', async () => {
      const user = { id: 1 };
      repo.findOneOrFail.mockResolvedValue(user);

      await expect(service.update(1, { googleId: 'g' })).resolves.toBe(user);
      expect(repo.assign).toHaveBeenCalledWith(user, { googleId: 'g' });
      expect(em.flush).toHaveBeenCalledTimes(1);
    });
  });

  describe('delete', () => {
    it('removes the user', async () => {
      const user = { id: 1 };
      repo.findOne.mockResolvedValue(user);

      await service.delete(1);

      expect(em.remove).toHaveBeenCalledWith(user);
      expect(em.flush).toHaveBeenCalledTimes(1);
    });

    it('throws when missing', async () => {
      repo.findOne.mockResolvedValue(null);
      await expect(service.delete(1)).rejects.toBeInstanceOf(NotFoundException);
      expect(em.remove).not.toHaveBeenCalled();
    });
  });

  describe('updateProfile', () => {
    it('throws when the user is missing', async () => {
      repo.findOne.mockResolvedValue(null);
      await expect(service.updateProfile(1, {})).rejects.toBeInstanceOf(
        NotFoundException,
      );
    });

    it('rejects a username used by another user', async () => {
      repo.findOne
        .mockResolvedValueOnce({ id: 1 })
        .mockResolvedValueOnce({ id: 2 });

      await expect(
        service.updateProfile(1, { username: 'taken' }),
      ).rejects.toBeInstanceOf(ConflictException);
      expect(repo.assign).not.toHaveBeenCalled();
    });

    it('allows keeping its own username', async () => {
      const user = { id: 1 };
      repo.findOne.mockResolvedValueOnce(user).mockResolvedValueOnce(user);

      await expect(service.updateProfile(1, { username: 'me' })).resolves.toBe(
        user,
      );
      expect(repo.assign).toHaveBeenCalledWith(user, { username: 'me' });
      expect(em.flush).toHaveBeenCalledTimes(1);
    });

    it('skips the uniqueness check without username', async () => {
      const user = { id: 1 };
      repo.findOne.mockResolvedValue(user);

      await service.updateProfile(1, { avatarUrl: 'u' });

      expect(repo.findOne).toHaveBeenCalledTimes(1);
      expect(repo.assign).toHaveBeenCalledWith(user, { avatarUrl: 'u' });
    });
  });
});
