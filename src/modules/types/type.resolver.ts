import { Args, ID, Mutation, Query, Resolver } from '@nestjs/graphql';
import { CardTypeEntity } from './type.entity';
import { CreateCardTypeInput, UpdateCardTypeInput } from './dto/type.inputs';
import { TypesService } from './types.service';
import { Admin, PlayerOrAdmin } from '../auth/decorators/admin.decorator';

@Resolver(() => CardTypeEntity)
export class CardTypeResolver {
  constructor(private readonly service: TypesService) {}

  @PlayerOrAdmin()
  @Query(() => [CardTypeEntity])
  cardTypes() {
    return this.service.findAll();
  }

  @PlayerOrAdmin()
  @Query(() => CardTypeEntity)
  cardType(@Args('id', { type: () => ID }) id: number) {
    return this.service.findOne(id);
  }

  @Admin()
  @Mutation(() => CardTypeEntity)
  createCardType(@Args('input') input: CreateCardTypeInput) {
    return this.service.create(input);
  }

  @Admin()
  @Mutation(() => CardTypeEntity)
  updateCardType(
    @Args('id', { type: () => ID }) id: number,
    @Args('input') input: UpdateCardTypeInput,
  ) {
    return this.service.update(id, input);
  }

  @Admin()
  @Mutation(() => Boolean)
  removeCardType(@Args('id', { type: () => ID }) id: number) {
    return this.service.remove(id);
  }
}
