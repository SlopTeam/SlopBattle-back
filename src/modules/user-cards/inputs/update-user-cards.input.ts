import { InputType, Field, ID } from "@nestjs/graphql";
import { IsInt } from "class-validator";
import { Int } from "@nestjs/graphql";

@InputType()
export class UpdateUserCardsInput {
    @Field(() => [Int])
    @IsInt({ each: true })
    cardIds: number[];
}