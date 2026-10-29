import { jest } from '@jest/globals';
import { ConflictException } from '@nestjs/common';
import { AdminService } from '../admin.service';

describe('AdminService', () => {
  let service: AdminService;
  const repo = {
    findOne: jest.fn<(...args: any[]) => any>(),
    create: jest.fn<(...args: any[]) => any>(),
  };
  const em = { flush: jest.fn<(...args: any[]) => any>() };

  beforeEach(() => {
    jest.resetAllMocks();
    service = new AdminService(repo as any, em as any);
  });

  it('finds an admin by normalized email and by id', async () => {
    repo.findOne.mockResolvedValue(null);
    await service.findByEmail('  Admin@SlopBattle.FR ');
    await service.findById(3);
    expect(repo.findOne).toHaveBeenNthCalledWith(1, {
      email: 'admin@slopbattle.fr',
    });
    expect(repo.findOne).toHaveBeenNthCalledWith(2, { id: 3 });
  });

  it('creates an admin with a normalized email', async () => {
    repo.findOne.mockResolvedValue(null);
    repo.create.mockImplementation((data) => ({ id: 1, ...(data as object) }));

    await expect(service.create(' A@B.C', 'hash')).resolves.toEqual({
      id: 1,
      email: 'a@b.c',
      passwordHash: 'hash',
    });
    expect(em.flush).toHaveBeenCalled();
  });

  it('refuses a second admin with the same email', async () => {
    repo.findOne.mockResolvedValue({ id: 1 });
    await expect(service.create('a@b.c', 'hash')).rejects.toBeInstanceOf(
      ConflictException,
    );
    expect(repo.create).not.toHaveBeenCalled();
  });
});
