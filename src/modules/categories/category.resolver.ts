import { Args, ID, Mutation, Query, Resolver } from '@nestjs/graphql';
import { Category } from './category.entity';
import {
  CreateCategoryInput,
  UpdateCategoryInput,
} from './dto/category.inputs';
import { CategoriesService } from './categories.service';

@Resolver(() => Category)
export class CategoryResolver {
  constructor(private readonly service: CategoriesService) {}

  @Query(() => [Category])
  categories() {
    return this.service.findAll();
  }

  @Query(() => Category)
  category(@Args('id', { type: () => ID }) id: number) {
    return this.service.findOne(id);
  }

  @Mutation(() => Category)
  createCategory(@Args('input') input: CreateCategoryInput) {
    return this.service.create(input);
  }

  @Mutation(() => Category)
  updateCategory(
    @Args('id', { type: () => ID }) id: number,
    @Args('input') input: UpdateCategoryInput,
  ) {
    return this.service.update(id, input);
  }

  @Mutation(() => Boolean)
  removeCategory(@Args('id', { type: () => ID }) id: number) {
    return this.service.remove(id);
  }
}
