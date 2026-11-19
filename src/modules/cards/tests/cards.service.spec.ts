import { jest } from '@jest/globals';
import { CardsService } from '../cards.service';
import { Card } from '../card.entity';
import { CardSort } from '../models/cards-page.model';

describe('CardsService', () => {
  let service: CardsService;
  const populate = ['categories', 'types'];
  const em = {
    find: jest.fn<(...args: any[]) => any>(),
    findAndCount: jest.fn<(...args: any[]) => any>(),
    findOneOrFail: jest.fn<(...args: any[]) => any>(),
    create: jest.fn<(...args: any[]) => any>(),
    assign: jest.fn<(...args: any[]) => any>(),
    populate: jest.fn<(...args: any[]) => any>(),
    flush: jest.fn<(...args: any[]) => any>(),
    nativeDelete: jest.fn<(...args: any[]) => any>(),
  };

  beforeEach(() => {
    jest.resetAllMocks();
    service = new CardsService(em as any);
  });

  it('findAll populates categories and types', async () => {
    em.find.mockResolvedValue([]);
    await service.findAll();
    expect(em.find).toHaveBeenCalledWith(Card, {}, { populate });
  });

  it('findAll ignores empty filters', async () => {
    em.find.mockResolvedValue([]);
    await service.findAll({ categoryIds: [], typeIds: [] });
    expect(em.find).toHaveBeenCalledWith(Card, {}, { populate });
  });

  it('findAll filters by rarity, category and type', async () => {
    em.find.mockResolvedValue([]);
    await service.findAll({ rarityId: 1, categoryIds: [2, 3], typeIds: [4] });
    expect(em.find).toHaveBeenCalledWith(
      Card,
      {
        rarityId: 1,
        categories: { id: { $in: [2, 3] } },
        types: { id: { $in: [4] } },
      },
      { populate },
    );
  });

  it('findAll searches the title, case-insensitively and literally', async () => {
    em.find.mockResolvedValue([]);
    await service.findAll({ search: '  50%_off ' });
    expect(em.find).toHaveBeenCalledWith(
      Card,
      { title: { $ilike: '%50\\%\\_off%' } },
      { populate },
    );
  });

  it('findAll ignores a blank search', async () => {
    em.find.mockResolvedValue([]);
    await service.findAll({ search: '   ' });
    expect(em.find).toHaveBeenCalledWith(Card, {}, { populate });
  });

  describe('findPage', () => {
    it('returns one page with the total', async () => {
      const items = [{ id: 3 }];
      em.findAndCount.mockResolvedValue([items, 45]);

      const result = await service.findPage(
        { rarityId: 2 },
        2,
        20,
        CardSort.TITLE_ASC,
      );

      expect(em.findAndCount).toHaveBeenCalledWith(
        Card,
        { rarityId: 2 },
        {
          populate,
          orderBy: [{ title: 'asc' }, { id: 'asc' }],
          limit: 20,
          offset: 20,
        },
      );
      expect(result).toEqual({
        items,
        total: 45,
        page: 2,
        pageSize: 20,
        pageCount: 3,
      });
    });

    it('clamps page and pageSize', async () => {
      em.findAndCount.mockResolvedValue([[], 0]);

      const result = await service.findPage(undefined, 0, 500, CardSort.NEWEST);

      expect(em.findAndCount).toHaveBeenCalledWith(
        Card,
        {},
        expect.objectContaining({ limit: 100, offset: 0 }),
      );
      expect(result).toMatchObject({ page: 1, pageSize: 100, pageCount: 1 });
    });

    it('sorts by rarity, rarest first, then by title', async () => {
      em.findAndCount.mockResolvedValue([[], 0]);
      await service.findPage(undefined, 1, 10, CardSort.RARITY_DESC);
      expect(em.findAndCount).toHaveBeenCalledWith(
        Card,
        {},
        expect.objectContaining({
          orderBy: [{ rarityId: 'desc' }, { title: 'asc' }, { id: 'asc' }],
        }),
      );
    });
  });

  it('findOne populates categories and types', async () => {
    em.findOneOrFail.mockResolvedValue({ id: 1 });
    await expect(service.findOne(1)).resolves.toEqual({ id: 1 });
    expect(em.findOneOrFail).toHaveBeenCalledWith(Card, 1, { populate });
  });

  describe('create', () => {
    it('maps ids to relations and refreshes the populated card', async () => {
      const card = { id: 1 };
      em.create.mockReturnValue(card);

      const result = await service.create({
        name: 'a',
        categoryIds: [1],
        typeIds: [2],
      } as any);

      expect(em.create).toHaveBeenCalledWith(Card, {
        name: 'a',
        categories: [1],
        types: [2],
      });
      expect(em.flush).toHaveBeenCalledTimes(1);
      expect(em.populate).toHaveBeenCalledWith(card, populate, {
        refresh: true,
      });
      expect(result).toBe(card);
    });

    it('defaults relations to empty arrays', async () => {
      em.create.mockReturnValue({});
      await service.create({ name: 'a' } as any);
      expect(em.create).toHaveBeenCalledWith(Card, {
        name: 'a',
        categories: [],
        types: [],
      });
    });
  });

  describe('update', () => {
    it('assigns the changes including relations', async () => {
      const card = { id: 1 };
      em.findOneOrFail.mockResolvedValue(card);

      const result = await service.update(1, {
        name: 'b',
        categoryIds: [3],
        typeIds: [4],
      } as any);

      expect(em.assign).toHaveBeenCalledWith(card, {
        name: 'b',
        categories: [3],
        types: [4],
      });
      expect(em.flush).toHaveBeenCalledTimes(1);
      expect(em.populate).toHaveBeenCalledWith(card, populate, {
        refresh: true,
      });
      expect(result).toBe(card);
    });

    it('leaves relations untouched when ids are omitted', async () => {
      const card = { id: 1 };
      em.findOneOrFail.mockResolvedValue(card);

      await service.update(1, { name: 'b' } as any);

      expect(em.assign).toHaveBeenCalledWith(card, { name: 'b' });
    });

    it('propagates a missing card', async () => {
      em.findOneOrFail.mockRejectedValue(new Error('not found'));
      await expect(service.update(1, {} as any)).rejects.toThrow('not found');
      expect(em.flush).not.toHaveBeenCalled();
    });
  });

  it('remove deletes the card', async () => {
    await expect(service.remove(1)).resolves.toBe(true);
    expect(em.nativeDelete).toHaveBeenCalledWith(Card, 1);
  });
});
