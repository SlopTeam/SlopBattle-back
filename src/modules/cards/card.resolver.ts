import { Args, ID, Int, Mutation, Query, Resolver } from '@nestjs/graphql';
import { Card } from './card.entity';
import {
  CardsFilterInput,
  CreateCardInput,
  UpdateCardInput,
} from './dto/card.inputs';
import { CardsService } from './cards.service';
import { CardSort, CardsPage } from './models/cards-page.model';
import { Admin, PlayerOrAdmin } from '../auth/decorators/admin.decorator';

@Resolver(() => Card)
export class CardResolver {
  constructor(private readonly cardsService: CardsService) {}

  @PlayerOrAdmin()
  @Query(() => [Card])
  cards(
    @Args('filter', { type: () => CardsFilterInput, nullable: true })
    filter?: CardsFilterInput,
  ) {
    return this.cardsService.findAll(filter);
  }

  @PlayerOrAdmin()
  @Query(() => CardsPage, {
    description: 'One page of cards; pageSize is clamped to 1..100',
  })
  cardsPage(
    @Args('filter', { type: () => CardsFilterInput, nullable: true })
    filter: CardsFilterInput | undefined,
    @Args('page', { type: () => Int, defaultValue: 1 }) page: number,
    @Args('pageSize', { type: () => Int, defaultValue: 20 }) pageSize: number,
    @Args('sort', { type: () => CardSort, defaultValue: CardSort.TITLE_ASC })
    sort: CardSort,
  ) {
    return this.cardsService.findPage(filter, page, pageSize, sort);
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
