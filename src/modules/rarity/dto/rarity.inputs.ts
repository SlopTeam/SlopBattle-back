import { Field, InputType, Int, PartialType } from '@nestjs/graphql';
import { IsInt, IsNotEmpty, IsOptional, IsString } from 'class-validator';

@InputType()
export class CreateRarityInput {
  @Field()
  @IsString()
  @IsNotEmpty()
  name!: string;

  @Field(() => Int, { nullable: true })
  @IsOptional()
  @IsInt()
  sortOrder?: number;
}

@InputType()
export class UpdateRarityInput extends PartialType(CreateRarityInput) {}
