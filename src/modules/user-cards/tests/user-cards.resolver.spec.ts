import { jest } from '@jest/globals';
import { UserCardsResolver } from '../resolvers/user-cards.resolver';
import type { UserCardsService } from '../user-cards.service';

describe('UserCardsResolver', () => {
  let resolver: UserCardsResolver;
  const service = {
    findCollectionByUserId: jest.fn<(...args: any[]) => any>(),
    addCards: jest.fn<(...args: any[]) => any>(),
    removeCards: jest.fn<(...args: any[]) => any>(),
  };
  const user = { id: 7 } as any;

  beforeEach(() => {
    jest.resetAllMocks();
    resolver = new UserCardsResolver(service as unknown as UserCardsService);
  });

  it('myCardCollection uses the current user id', async () => {
    const collection = { userId: 7, cards: [] };
    service.findCollectionByUserId.mockResolvedValue(collection);

    await expect(resolver.myCardCollection(user)).resolves.toBe(collection);
    expect(service.findCollectionByUserId).toHaveBeenCalledWith(7);
  });

  it('addCardsInCollection forwards the card ids', async () => {
    service.addCards.mockResolvedValue([]);
    await resolver.addCardsInCollection(user, { cardIds: [2, 3] });
    expect(service.addCards).toHaveBeenCalledWith(7, [2, 3]);
  });

  it('removeCardsFromCollection forwards the card ids', async () => {
    service.removeCards.mockResolvedValue([]);
    await resolver.removeCardsFromCollection(user, { cardIds: [2] });
    expect(service.removeCards).toHaveBeenCalledWith(7, [2]);
  });
});