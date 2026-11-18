import { Field, InputType, Int, PartialType, OmitType } from '@nestjs/graphql';
import { IsBoolean, IsInt, Min } from 'class-validator';

@InputType()
export class AddCardToBoosterInput {
  @Field(() => Int)
  @IsInt()
  boosterId!: number;

  @Field(() => Int)
  @IsInt()
  cardId!: number;

  @Field()
  @IsBoolean()
  isBanner!: boolean;

  @Field(() => Int)
  @IsInt()
  @Min(0)
  dropRate!: number;
}

@InputType()
export class UpdateBoosterCardInput extends PartialType(
  OmitType(AddCardToBoosterInput, ['boosterId', 'cardId'] as const),
) {}
