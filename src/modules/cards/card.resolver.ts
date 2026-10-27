import { Args, ID, Mutation, Query, Resolver } from '@nestjs/graphql';
import { Card } from './card.entity';
import { CreateCardInput, UpdateCardInput } from './dto/card.inputs';
import { CardsService } from './cards.service';
import { GqlJwtAuthGuard } from '../auth/guards/gql-jwt-auth.guard';
import { UseGuards } from '@nestjs/common';

@Resolver(() => Card)
export class CardResolver {
  constructor(private readonly cardsService: CardsService) {}

  @UseGuards(GqlJwtAuthGuard)
  @Query(() => [Card])
  cards() {
    return this.cardsService.findAll();
  }

  @UseGuards(GqlJwtAuthGuard)
  @Query(() => Card)
  card(@Args('id', { type: () => ID }) id: number) {
    return this.cardsService.findOne(id);
  }
  
  @Mutation(() => Card)
  createCard(@Args('input') input: CreateCardInput) {
    return this.cardsService.create(input);
  }

  @Mutation(() => Card)
  updateCard(
    @Args('id', { type: () => ID }) id: number,
    @Args('input') input: UpdateCardInput,
  ) {
    return this.cardsService.update(id, input);
  }

  @Mutation(() => Boolean)
  removeCard(@Args('id', { type: () => ID }) id: number) {
    return this.cardsService.remove(id);
  }
}
