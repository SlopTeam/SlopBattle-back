import { Field, InputType, PartialType } from '@nestjs/graphql';
import { IsNotEmpty, IsString } from 'class-validator';

@InputType()
export class CreateCardTypeInput {
  @Field()
  @IsString()
  @IsNotEmpty()
  name!: string;
}

@InputType()
export class UpdateCardTypeInput extends PartialType(CreateCardTypeInput) {}
