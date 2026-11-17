import { Args, ID, Mutation, Query, Resolver } from '@nestjs/graphql';
import { CategoryEntity } from './category.entity';
import {
  CreateCategoryInput,
  UpdateCategoryInput,
} from './dto/category.inputs';
import { CategoriesService } from './categories.service';
import { Admin, PlayerOrAdmin } from '../auth/decorators/admin.decorator';

@Resolver(() => CategoryEntity)
export class CategoryResolver {
  constructor(private readonly service: CategoriesService) {}

  @PlayerOrAdmin()
  @Query(() => [CategoryEntity])
  categories() {
    return this.service.findAll();
  }

  @PlayerOrAdmin()
  @Query(() => CategoryEntity)
  category(@Args('id', { type: () => ID }) id: number) {
    return this.service.findOne(id);
  }

  @Admin()
  @Mutation(() => CategoryEntity)
  createCategory(@Args('input') input: CreateCategoryInput) {
    return this.service.create(input);
  }

  @Admin()
  @Mutation(() => CategoryEntity)
  updateCategory(
    @Args('id', { type: () => ID }) id: number,
    @Args('input') input: UpdateCategoryInput,
  ) {
    return this.service.update(id, input);
  }

  @Admin()
  @Mutation(() => Boolean)
  removeCategory(@Args('id', { type: () => ID }) id: number) {
    return this.service.remove(id);
  }
}
