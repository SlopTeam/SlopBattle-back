import { Field, InputType, PartialType } from '@nestjs/graphql';

@InputType()
export class CreateCategoryInput {
  @Field()
  name!: string;
}

@InputType()
export class UpdateCategoryInput extends PartialType(CreateCategoryInput) {}
