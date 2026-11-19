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

  @Field(() => Int, {
    nullable: true,
    description: 'Image uploaded with uploadMedia; replaces imageUrl',
  })
  @IsOptional()
  @IsInt()
  mediaId?: number;

  @Field({
    nullable: true,
    description: 'Legacy external image link, used when mediaId is not given',
  })
  @IsOptional()
  @IsString()
  imageUrl?: string;

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
