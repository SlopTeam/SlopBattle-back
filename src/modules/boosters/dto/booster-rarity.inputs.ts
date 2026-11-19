import { Field, InputType, Int, OmitType, PartialType } from '@nestjs/graphql';
import { IsInt, Min } from 'class-validator';

@InputType()
export class AddRarityToBoosterInput {
  @Field(() => Int)
  @IsInt()
  boosterId!: number;

  @Field(() => Int)
  @IsInt()
  rarityId!: number;

  @Field(() => Int)
  @IsInt()
  @Min(0)
  dropRate!: number;
}

@InputType()
export class UpdateBoosterRarityInput extends PartialType(
  OmitType(AddRarityToBoosterInput, ['boosterId', 'rarityId'] as const),
) {}
