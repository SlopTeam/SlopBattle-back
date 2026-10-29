import { jest } from '@jest/globals';
import { TypesService } from '../types.service';
import { CardTypeEntity } from '../type.entity';

describe('TypesService', () => {
  let service: TypesService;
  const em = {
    find: jest.fn<(...args: any[]) => any>(),
    findOneOrFail: jest.fn<(...args: any[]) => any>(),
    create: jest.fn<(...args: any[]) => any>(),
    assign: jest.fn<(...args: any[]) => any>(),
    flush: jest.fn<(...args: any[]) => any>(),
    nativeDelete: jest.fn<(...args: any[]) => any>(),
  };

  beforeEach(() => {
    jest.resetAllMocks();
    service = new TypesService(em as any);
  });

  it('findAll returns every type', async () => {
    em.find.mockResolvedValue([{ id: 1 }]);
    await expect(service.findAll()).resolves.toEqual([{ id: 1 }]);
    expect(em.find).toHaveBeenCalledWith(CardTypeEntity, {});
  });

  it('findOne loads a type by id', async () => {
    em.findOneOrFail.mockResolvedValue({ id: 1 });
    await expect(service.findOne(1)).resolves.toEqual({ id: 1 });
    expect(em.findOneOrFail).toHaveBeenCalledWith(CardTypeEntity, 1);
  });

  it('create persists the new type', async () => {
    const created = { id: 1 };
    em.create.mockReturnValue(created);

    await expect(service.create({ name: 'a' } as any)).resolves.toBe(created);
    expect(em.create).toHaveBeenCalledWith(CardTypeEntity, { name: 'a' });
    expect(em.flush).toHaveBeenCalledTimes(1);
  });

  it('update assigns the changes and flushes', async () => {
    const existing = { id: 1 };
    em.findOneOrFail.mockResolvedValue(existing);

    await expect(service.update(1, { name: 'b' } as any)).resolves.toBe(existing);
    expect(em.assign).toHaveBeenCalledWith(existing, { name: 'b' });
    expect(em.flush).toHaveBeenCalledTimes(1);
  });

  it('update propagates a missing type', async () => {
    em.findOneOrFail.mockRejectedValue(new Error('not found'));
    await expect(service.update(1, {} as any)).rejects.toThrow('not found');
    expect(em.flush).not.toHaveBeenCalled();
  });

  it('remove deletes the type', async () => {
    await expect(service.remove(1)).resolves.toBe(true);
    expect(em.nativeDelete).toHaveBeenCalledWith(CardTypeEntity, 1);
  });
});
