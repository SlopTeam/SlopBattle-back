import { Args, ID, Mutation, Query, Resolver } from '@nestjs/graphql';
import { RarityEntity } from './rarity.entity';
import { CreateRarityInput, UpdateRarityInput } from './dto/rarity.inputs';
import { RarityService } from './rarity.service';
import { Admin, PlayerOrAdmin } from '../auth/decorators/admin.decorator';

@Resolver(() => RarityEntity)
export class RarityResolver {
  constructor(private readonly service: RarityService) {}

  @PlayerOrAdmin()
  @Query(() => [RarityEntity])
  rarities() {
    return this.service.findAll();
  }

  @PlayerOrAdmin()
  @Query(() => RarityEntity)
  rarity(@Args('id', { type: () => ID }) id: number) {
    return this.service.findOne(id);
  }

  @Admin()
  @Mutation(() => RarityEntity)
  createRarity(@Args('input') input: CreateRarityInput) {
    return this.service.create(input);
  }

  @Admin()
  @Mutation(() => RarityEntity)
  updateRarity(
    @Args('id', { type: () => ID }) id: number,
    @Args('input') input: UpdateRarityInput,
  ) {
    return this.service.update(id, input);
  }

  @Admin()
  @Mutation(() => Boolean)
  removeRarity(@Args('id', { type: () => ID }) id: number) {
    return this.service.remove(id);
  }
}
