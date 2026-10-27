import { Args, ID, Mutation, Query, Resolver } from '@nestjs/graphql';
import { CardType } from './type.entity';
import { CreateCardTypeInput, UpdateCardTypeInput } from './dto/type.inputs';
import { TypesService } from './types.service';
import { UseGuards } from '@nestjs/common';
import { GqlJwtAuthGuard } from '../auth/guards/gql-jwt-auth.guard';

@Resolver(() => CardType)
export class CardTypeResolver {
  constructor(private readonly service: TypesService) {}

  @UseGuards(GqlJwtAuthGuard)
  @Query(() => [CardType])
  cardTypes() {
    return this.service.findAll();
  }

  @UseGuards(GqlJwtAuthGuard)
  @Query(() => CardType)
  cardType(@Args('id', { type: () => ID }) id: number) {
    return this.service.findOne(id);
  }

  @Mutation(() => CardType)
  createCardType(@Args('input') input: CreateCardTypeInput) {
    return this.service.create(input);
  }

  @Mutation(() => CardType)
  updateCardType(
    @Args('id', { type: () => ID }) id: number,
    @Args('input') input: UpdateCardTypeInput,
  ) {
    return this.service.update(id, input);
  }

  @Mutation(() => Boolean)
  removeCardType(@Args('id', { type: () => ID }) id: number) {
    return this.service.remove(id);
  }
}
