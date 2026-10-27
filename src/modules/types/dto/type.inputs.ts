import { Field, InputType, PartialType } from '@nestjs/graphql';

@InputType()
export class CreateCardTypeInput {
  @Field()
  name!: string;
}

@InputType()
export class UpdateCardTypeInput extends PartialType(CreateCardTypeInput) {}
