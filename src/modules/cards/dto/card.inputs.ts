import { Field, InputType, Int, PartialType } from '@nestjs/graphql';
import { IsInt, IsOptional, IsString, MaxLength } from 'class-validator';

@InputType()
export class CreateCardInput {
  @Field()
  @IsString()
  title!: string;

  @Field({ nullable: true })
  @IsString()
  @IsOptional()
  description?: string;

  @Field()
  @IsString()
  imageUrl!: string;

  @Field(() => Int)
  @IsOptional()
  @IsInt()
  rarityId!: number;

  @Field(() => [Int], { nullable: true })
  @IsOptional()
  @IsInt({ each: true })
  categoryIds?: number[];

  @Field(() => [Int], { nullable: true })
  @IsOptional()
  @IsInt({ each: true })
  typeIds?: number[];
}

@InputType()
export class CardsFilterInput {
  @Field({
    nullable: true,
    description: 'Case-insensitive substring of the title',
  })
  @IsOptional()
  @IsString()
  @MaxLength(100)
  search?: string;

  @Field(() => Int, { nullable: true })
  @IsOptional()
  @IsInt()
  rarityId?: number;

  @Field(() => [Int], { nullable: true })
  @IsOptional()
  @IsInt({ each: true })
  categoryIds?: number[];

  @Field(() => [Int], { nullable: true })
  @IsOptional()
  @IsInt({ each: true })
  typeIds?: number[];
}

@InputType()
export class UpdateCardInput extends PartialType(CreateCardInput) {}
