import { jest } from '@jest/globals';
import { CategoryResolver } from '../category.resolver';
import type { CategoriesService } from '../categories.service';

describe('CategoryResolver', () => {
  let resolver: CategoryResolver;
  const service = {
    findAll: jest.fn<(...args: any[]) => any>(),
    findOne: jest.fn<(...args: any[]) => any>(),
    create: jest.fn<(...args: any[]) => any>(),
    update: jest.fn<(...args: any[]) => any>(),
    remove: jest.fn<(...args: any[]) => any>(),
  };

  beforeEach(() => {
    jest.resetAllMocks();
    resolver = new CategoryResolver(service as unknown as CategoriesService);
  });

  it('categories delegates to findAll', async () => {
    service.findAll.mockResolvedValue([]);
    await expect(resolver.categories()).resolves.toEqual([]);
  });

  it('category delegates to findOne', async () => {
    service.findOne.mockResolvedValue({ id: 1 });
    await expect(resolver.category(1)).resolves.toEqual({ id: 1 });
    expect(service.findOne).toHaveBeenCalledWith(1);
  });

  it('createCategory forwards the input', async () => {
    const input = { name: 'a' } as any;
    service.create.mockResolvedValue({ id: 1 });
    await resolver.createCategory(input);
    expect(service.create).toHaveBeenCalledWith(input);
  });

  it('updateCategory forwards id and input', async () => {
    const input = { name: 'b' } as any;
    service.update.mockResolvedValue({ id: 1 });
    await resolver.updateCategory(1, input);
    expect(service.update).toHaveBeenCalledWith(1, input);
  });

  it('removeCategory forwards the id', async () => {
    service.remove.mockResolvedValue(true);
    await expect(resolver.removeCategory(1)).resolves.toBe(true);
    expect(service.remove).toHaveBeenCalledWith(1);
  });
});
