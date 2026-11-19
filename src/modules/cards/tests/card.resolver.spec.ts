import { jest } from '@jest/globals';
import { CardResolver } from '../card.resolver';
import type { CardsService } from '../cards.service';
import { CardSort } from '../models/cards-page.model';

describe('CardResolver', () => {
  let resolver: CardResolver;
  const service = {
    findAll: jest.fn<(...args: any[]) => any>(),
    findPage: jest.fn<(...args: any[]) => any>(),
    findOne: jest.fn<(...args: any[]) => any>(),
    create: jest.fn<(...args: any[]) => any>(),
    update: jest.fn<(...args: any[]) => any>(),
    remove: jest.fn<(...args: any[]) => any>(),
  };

  beforeEach(() => {
    jest.resetAllMocks();
    resolver = new CardResolver(service as unknown as CardsService);
  });

  it('cards delegates to findAll without filter', async () => {
    service.findAll.mockResolvedValue([]);
    await expect(resolver.cards()).resolves.toEqual([]);
    expect(service.findAll).toHaveBeenCalledWith(undefined);
  });

  it('cards forwards the filter to findAll', async () => {
    const filter = { rarityId: 1, categoryIds: [2], typeIds: [3] };
    service.findAll.mockResolvedValue([]);
    await expect(resolver.cards(filter)).resolves.toEqual([]);
    expect(service.findAll).toHaveBeenCalledWith(filter);
  });

  it('cardsPage forwards filter, page, size and sort to findPage', async () => {
    const filter = { search: 'slop' };
    const page = { items: [], total: 0, page: 2, pageSize: 10, pageCount: 1 };
    service.findPage.mockResolvedValue(page);
    await expect(
      resolver.cardsPage(filter, 2, 10, CardSort.NEWEST),
    ).resolves.toBe(page);
    expect(service.findPage).toHaveBeenCalledWith(
      filter,
      2,
      10,
      CardSort.NEWEST,
    );
  });

  it('card delegates to findOne', async () => {
    service.findOne.mockResolvedValue({ id: 1 });
    await expect(resolver.card(1)).resolves.toEqual({ id: 1 });
    expect(service.findOne).toHaveBeenCalledWith(1);
  });

  it('createCard forwards the input', async () => {
    const input = { name: 'a' } as any;
    service.create.mockResolvedValue({ id: 1 });
    await resolver.createCard(input);
    expect(service.create).toHaveBeenCalledWith(input);
  });

  it('updateCard forwards id and input', async () => {
    const input = { name: 'b' } as any;
    service.update.mockResolvedValue({ id: 1 });
    await resolver.updateCard(1, input);
    expect(service.update).toHaveBeenCalledWith(1, input);
  });

  it('removeCard forwards the id', async () => {
    service.remove.mockResolvedValue(true);
    await expect(resolver.removeCard(1)).resolves.toBe(true);
    expect(service.remove).toHaveBeenCalledWith(1);
  });
});
