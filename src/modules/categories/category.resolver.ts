import { Args, ID, Mutation, Query, Resolver } from '@nestjs/graphql';
import { CategoryEntity } from './category.entity';
import {
  CreateCategoryInput,
  UpdateCategoryInput,
} from './dto/category.inputs';
import { CategoriesService } from './categories.service';
import { UseGuards } from '@nestjs/common';
import { GqlJwtAuthGuard } from '../auth/guards/gql-jwt-auth.guard';

@Resolver(() => CategoryEntity)
export class CategoryResolver {
  constructor(private readonly service: CategoriesService) {}

  @UseGuards(GqlJwtAuthGuard)
  @Query(() => [CategoryEntity])
  categories() {
    return this.service.findAll();
  }

  @UseGuards(GqlJwtAuthGuard)
  @Query(() => CategoryEntity)
  category(@Args('id', { type: () => ID }) id: number) {
    return this.service.findOne(id);
  }

  @Mutation(() => CategoryEntity)
  createCategory(@Args('input') input: CreateCategoryInput) {
    return this.service.create(input);
  }

  @Mutation(() => CategoryEntity)
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
