import { Args, ID, Mutation, Query, Resolver } from '@nestjs/graphql';
import { Card } from './card.entity';
import { CreateCardInput, UpdateCardInput } from './dto/card.inputs';
import { CardsService } from './cards.service';
import { Admin, PlayerOrAdmin } from '../auth/decorators/admin.decorator';

@Resolver(() => Card)
export class CardResolver {
  constructor(private readonly cardsService: CardsService) {}

  @PlayerOrAdmin()
  @Query(() => [Card])
  cards() {
    return this.cardsService.findAll();
  }

  @PlayerOrAdmin()
  @Query(() => Card)
  card(@Args('id', { type: () => ID }) id: number) {
    return this.cardsService.findOne(id);
  }

  @Admin()
  @Mutation(() => Card)
  createCard(@Args('input') input: CreateCardInput) {
    return this.cardsService.create(input);
  }

  @Admin()
  @Mutation(() => Card)
  updateCard(
    @Args('id', { type: () => ID }) id: number,
    @Args('input') input: UpdateCardInput,
  ) {
    return this.cardsService.update(id, input);
  }

  @Admin()
  @Mutation(() => Boolean)
  removeCard(@Args('id', { type: () => ID }) id: number) {
    return this.cardsService.remove(id);
  }
}
