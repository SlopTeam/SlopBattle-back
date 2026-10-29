import { jest } from '@jest/globals';
import { CardsService } from '../cards.service';
import { Card } from '../card.entity';

describe('CardsService', () => {
  let service: CardsService;
  const populate = ['categories', 'types'];
  const em = {
    find: jest.fn<(...args: any[]) => any>(),
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
      expect(em.populate).toHaveBeenCalledWith(card, populate, { refresh: true });
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
      expect(em.populate).toHaveBeenCalledWith(card, populate, { refresh: true });
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
