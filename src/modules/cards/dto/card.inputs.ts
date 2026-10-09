import { Field, InputType, Int, PartialType } from '@nestjs/graphql';

@InputType()
export class CreateCardInput {
  @Field()
  title!: string;

  @Field({ nullable: true })
  description?: string;

  @Field()
  imageUrl!: string;

  @Field(() => Int)
  rarityId!: number;
}

@InputType()
export class UpdateCardInput extends PartialType(CreateCardInput) {}
