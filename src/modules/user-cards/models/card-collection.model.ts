import { ObjectType, Field, ID } from "@nestjs/graphql";

@ObjectType()
export class CardCollection {
    @Field(() => ID)
    userId: number;

    @Field(() => [CollectionCard])
    cards: CollectionCard[];
}

@ObjectType()
class CollectionCard {
    @Field(() => ID)
    cardId: number;

    @Field()
    quantity: number;

    @Field()
    firstObtainedAt: Date;
}
