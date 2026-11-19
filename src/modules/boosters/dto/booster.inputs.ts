import { Field, InputType, Int, PartialType } from '@nestjs/graphql';
import {
  IsBoolean,
  IsDate,
  IsInt,
  IsNotEmpty,
  IsString,
  Min,
} from 'class-validator';
import { Type } from 'class-transformer';

@InputType()
export class CreateBoosterInput {
  @Field()
  @IsString()
  @IsNotEmpty()
  name!: string;

  @Field()
  @IsString()
  @IsNotEmpty()
  type!: string;

  @Field(() => Int)
  @IsInt()
  @Min(0)
  price!: number;

  @Field()
  @IsString()
  @IsNotEmpty()
  imageUrl!: string;

  @Field(() => Int)
  @IsInt()
  @Min(1)
  numberOfCards!: number;

  @Field(() => Date)
  @Type(() => Date)
  @IsDate()
  availableFrom!: Date;

  @Field(() => Date)
  @Type(() => Date)
  @IsDate()
  availableUntil!: Date;

  @Field()
  @IsBoolean()
  isActive!: boolean;
}

@InputType()
export class UpdateBoosterInput extends PartialType(CreateBoosterInput) {}
