import {
  Args,
  ID,
  Mutation,
  Parent,
  Query,
  ResolveField,
  Resolver,
} from '@nestjs/graphql';
import { BoosterEntity } from './entities/booster.entity';
import { BoosterCardsEntity } from './entities/booster-cards.entity';
import { BoosterRarityEntity } from './entities/booster-rarity.entity';
import { CreateBoosterInput, UpdateBoosterInput } from './dto/booster.inputs';
import {
  AddCardToBoosterInput,
  UpdateBoosterCardInput,
} from './dto/booster-cards.inputs';
import {
  AddRarityToBoosterInput,
  UpdateBoosterRarityInput,
} from './dto/booster-rarity.inputs';
import { BoosterService } from './booster.service';
import { Admin, PlayerOrAdmin } from '../auth/decorators/admin.decorator';

@Resolver(() => BoosterEntity)
export class BoosterResolver {
  constructor(private readonly service: BoosterService) {}

  @PlayerOrAdmin()
  @Query(() => [BoosterEntity])
  boosters() {
    return this.service.findAll();
  }

  @PlayerOrAdmin()
  @Query(() => BoosterEntity)
  booster(@Args('id', { type: () => ID }) id: number) {
    return this.service.findOne(id);
  }

  @Admin()
  @Mutation(() => BoosterEntity)
  createBooster(@Args('input') input: CreateBoosterInput) {
    return this.service.create(input);
  }

  @Admin()
  @Mutation(() => BoosterEntity)
  updateBooster(
    @Args('id', { type: () => ID }) id: number,
    @Args('input') input: UpdateBoosterInput,
  ) {
    return this.service.update(id, input);
  }

  @Admin()
  @Mutation(() => Boolean)
  removeBooster(@Args('id', { type: () => ID }) id: number) {
    return this.service.remove(id);
  }

  @ResolveField(() => [BoosterCardsEntity])
  cards(@Parent() booster: BoosterEntity) {
    return this.service.findCards(booster.id);
  }

  @Admin()
  @Mutation(() => BoosterCardsEntity)
  addCardToBooster(@Args('input') input: AddCardToBoosterInput) {
    return this.service.addCard(input);
  }

  @Admin()
  @Mutation(() => BoosterCardsEntity)
  updateBoosterCard(
    @Args('id', { type: () => ID }) id: number,
    @Args('input') input: UpdateBoosterCardInput,
  ) {
    return this.service.updateCard(id, input);
  }

  @Admin()
  @Mutation(() => Boolean)
  removeCardFromBooster(@Args('id', { type: () => ID }) id: number) {
    return this.service.removeCard(id);
  }

  @PlayerOrAdmin()
  @ResolveField(() => [BoosterRarityEntity])
  rarities(@Parent() booster: BoosterEntity) {
    return this.service.findRarities(booster.id);
  }

  @Admin()
  @Mutation(() => BoosterRarityEntity)
  addRarityToBooster(@Args('input') input: AddRarityToBoosterInput) {
    return this.service.addRarity(input);
  }

  @Admin()
  @Mutation(() => BoosterRarityEntity)
  updateBoosterRarity(
    @Args('id', { type: () => ID }) id: number,
    @Args('input') input: UpdateBoosterRarityInput,
  ) {
    return this.service.updateRarity(id, input);
  }

  @Admin()
  @Mutation(() => Boolean)
  removeRarityFromBooster(@Args('id', { type: () => ID }) id: number) {
    return this.service.removeRarity(id);
  }
}
