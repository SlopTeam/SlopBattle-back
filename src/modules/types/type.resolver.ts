import { Args, ID, Mutation, Query, Resolver } from '@nestjs/graphql';
import { CardTypeEntity } from './type.entity';
import { CreateCardTypeInput, UpdateCardTypeInput } from './dto/type.inputs';
import { TypesService } from './types.service';
import { UseGuards } from '@nestjs/common';
import { GqlJwtAuthGuard } from '../auth/guards/gql-jwt-auth.guard';

@Resolver(() => CardTypeEntity)
export class CardTypeResolver {
  constructor(private readonly service: TypesService) {}

  @UseGuards(GqlJwtAuthGuard)
  @Query(() => [CardTypeEntity])
  cardTypes() {
    return this.service.findAll();
  }

  @UseGuards(GqlJwtAuthGuard)
  @Query(() => CardTypeEntity)
  cardType(@Args('id', { type: () => ID }) id: number) {
    return this.service.findOne(id);
  }

  @Mutation(() => CardTypeEntity)
  createCardType(@Args('input') input: CreateCardTypeInput) {
    return this.service.create(input);
  }

  @Mutation(() => CardTypeEntity)
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
