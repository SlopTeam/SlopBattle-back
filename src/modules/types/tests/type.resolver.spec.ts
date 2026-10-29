import { jest } from '@jest/globals';
import { CardTypeResolver } from '../type.resolver';
import type { TypesService } from '../types.service';

describe('CardTypeResolver', () => {
  let resolver: CardTypeResolver;
  const service = {
    findAll: jest.fn<(...args: any[]) => any>(),
    findOne: jest.fn<(...args: any[]) => any>(),
    create: jest.fn<(...args: any[]) => any>(),
    update: jest.fn<(...args: any[]) => any>(),
    remove: jest.fn<(...args: any[]) => any>(),
  };

  beforeEach(() => {
    jest.resetAllMocks();
    resolver = new CardTypeResolver(service as unknown as TypesService);
  });

  it('cardTypes delegates to findAll', async () => {
    service.findAll.mockResolvedValue([]);
    await expect(resolver.cardTypes()).resolves.toEqual([]);
  });

  it('cardType delegates to findOne', async () => {
    service.findOne.mockResolvedValue({ id: 1 });
    await expect(resolver.cardType(1)).resolves.toEqual({ id: 1 });
    expect(service.findOne).toHaveBeenCalledWith(1);
  });

  it('createCardType forwards the input', async () => {
    const input = { name: 'a' } as any;
    service.create.mockResolvedValue({ id: 1 });
    await resolver.createCardType(input);
    expect(service.create).toHaveBeenCalledWith(input);
  });

  it('updateCardType forwards id and input', async () => {
    const input = { name: 'b' } as any;
    service.update.mockResolvedValue({ id: 1 });
    await resolver.updateCardType(1, input);
    expect(service.update).toHaveBeenCalledWith(1, input);
  });

  it('removeCardType forwards the id', async () => {
    service.remove.mockResolvedValue(true);
    await expect(resolver.removeCardType(1)).resolves.toBe(true);
    expect(service.remove).toHaveBeenCalledWith(1);
  });
});
