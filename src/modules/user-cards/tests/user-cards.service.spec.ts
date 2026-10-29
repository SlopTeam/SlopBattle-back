import { jest } from '@jest/globals';
import { UserCardsService } from '../user-cards.service';

describe('UserCardsService', () => {
  let service: UserCardsService;
  const repo = {
    find: jest.fn<(...args: any[]) => any>(),
    findOne: jest.fn<(...args: any[]) => any>(),
    create: jest.fn<(...args: any[]) => any>(),
    assign: jest.fn<(...args: any[]) => any>(),
  };
  const em = {
    flush: jest.fn<(...args: any[]) => any>(),
    remove: jest.fn<(...args: any[]) => any>(),
  };

  beforeEach(() => {
    jest.resetAllMocks();
    service = new UserCardsService(repo as any, em as any);
  });

  describe('findCollectionByUserId', () => {
    it('maps the user cards to a collection', async () => {
      const date = new Date();
      repo.find.mockResolvedValue([
        { card: { id: 2 }, quantity: 3, firstObtainedAt: date },
      ]);

      await expect(service.findCollectionByUserId(1)).resolves.toEqual({
        userId: 1,
        cards: [{ cardId: 2, quantity: 3, firstObtainedAt: date }],
      });
      expect(repo.find).toHaveBeenCalledWith({ user: 1 });
    });

    it('returns an empty list when the user owns nothing', async () => {
      repo.find.mockResolvedValue([]);
      await expect(service.findCollectionByUserId(1)).resolves.toEqual({
        userId: 1,
        cards: [],
      });
    });
  });

  describe('addCards', () => {
    it('creates an entry with quantity 1 for a new card', async () => {
      const created = { quantity: 1 };
      repo.findOne.mockResolvedValue(null);
      repo.create.mockReturnValue(created);

      const result = await service.addCards(1, [2]);

      expect(repo.create).toHaveBeenCalledWith({
        user: 1,
        card: 2,
        quantity: 1,
        firstObtainedAt: expect.any(Date),
      });
      expect(em.flush).toHaveBeenCalledTimes(1);
      expect(result).toEqual([created]);
    });

    it('increments the quantity of an owned card', async () => {
      const existing = { quantity: 2 };
      repo.findOne.mockResolvedValue(existing);

      const result = await service.addCards(1, [2]);

      expect(repo.assign).toHaveBeenCalledWith(existing, { quantity: 3 });
      expect(repo.create).not.toHaveBeenCalled();
      expect(result).toEqual([existing]);
    });

    it('handles several cards', async () => {
      repo.findOne.mockResolvedValueOnce(null).mockResolvedValueOnce({ quantity: 1 });
      repo.create.mockReturnValue({ quantity: 1 });

      const result = await service.addCards(1, [2, 3]);

      expect(result).toHaveLength(2);
      expect(em.flush).toHaveBeenCalledTimes(2);
    });

    it('returns an empty list for no card ids', async () => {
      await expect(service.addCards(1, [])).resolves.toEqual([]);
    });
  });

  describe('removeCards', () => {
    it('decrements the quantity when more than one copy is owned', async () => {
      const existing = { quantity: 2 };
      repo.findOne.mockResolvedValue(existing);

      const result = await service.removeCards(1, [2]);

      expect(repo.assign).toHaveBeenCalledWith(existing, { quantity: 1 });
      expect(em.remove).not.toHaveBeenCalled();
      expect(result).toEqual([existing]);
    });

    it('removes the entry when only one copy is left', async () => {
      const existing = { quantity: 1 };
      repo.findOne.mockResolvedValue(existing);

      const result = await service.removeCards(1, [2]);

      expect(em.remove).toHaveBeenCalledWith(existing);
      expect(em.flush).toHaveBeenCalledTimes(1);
      expect(result).toEqual([]);
    });

    it('ignores cards the user does not own', async () => {
      repo.findOne.mockResolvedValue(null);

      await expect(service.removeCards(1, [2])).resolves.toEqual([]);
      expect(em.flush).not.toHaveBeenCalled();
    });
  });
});