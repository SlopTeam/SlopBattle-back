import { GUARDS_METADATA } from '@nestjs/common/constants';
import { CardResolver } from '../../cards/card.resolver';
import { CategoryResolver } from '../../categories/category.resolver';
import { CardTypeResolver } from '../../types/type.resolver';
import { GqlAdminAuthGuard } from '../guards/gql-admin-auth.guard';
import { GqlPlayerOrAdminAuthGuard } from '../guards/gql-player-or-admin-auth.guard';
import { AdminAuthResolver } from '../resolvers/admin-auth.resolver';

function guardsOf(target: object, method: string): unknown[] {
  return (
    Reflect.getMetadata(GUARDS_METADATA, (target as any).prototype[method]) ??
    []
  );
}

describe('admin guards on resolvers', () => {
  it.each([
    [CardResolver, ['createCard', 'updateCard', 'removeCard']],
    [CategoryResolver, ['createCategory', 'updateCategory', 'removeCategory']],
    [CardTypeResolver, ['createCardType', 'updateCardType', 'removeCardType']],
  ])('%p mutations are admin only', (resolver, methods) => {
    for (const method of methods) {
      expect(guardsOf(resolver, method)).toEqual([GqlAdminAuthGuard]);
    }
  });

  it.each([
    [CardResolver, ['cards', 'card']],
    [CategoryResolver, ['categories', 'category']],
    [CardTypeResolver, ['cardTypes', 'cardType']],
  ])('%p reads accept players and admins', (resolver, methods) => {
    for (const method of methods) {
      expect(guardsOf(resolver, method)).toEqual([GqlPlayerOrAdminAuthGuard]);
    }
  });

  it('adminMe needs an admin token, adminLogin is public', () => {
    expect(guardsOf(AdminAuthResolver, 'adminMe')).toEqual([GqlAdminAuthGuard]);
    expect(guardsOf(AdminAuthResolver, 'adminLogin')).toEqual([]);
  });
});
