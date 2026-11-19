import { Field, InputType, PartialType } from '@nestjs/graphql';
import { IsNotEmpty, IsString } from 'class-validator';

@InputType()
export class CreateCategoryInput {
  @Field()
  @IsString()
  @IsNotEmpty()
  name!: string;
}

@InputType()
export class UpdateCategoryInput extends PartialType(CreateCategoryInput) {}
