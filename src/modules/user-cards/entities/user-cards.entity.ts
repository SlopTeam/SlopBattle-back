import { Entity, ManyToOne, Property } from "@mikro-orm/decorators/legacy";
import { BaseEntity } from "../../base.entity";
import { User } from "../../user/entities/user.entity";
import { Card } from "../../cards/card.entity";
import { Field, Int, ObjectType } from "@nestjs/graphql";

@ObjectType()
@Entity({ tableName: 'user_cards' })
export class UserCardsEntity extends BaseEntity {
    @ManyToOne({ entity: () => User, fieldName: 'user_id' })
    user!: User;

    @Field(() => Card)
    @ManyToOne({ entity: () => Card, fieldName: 'card_id' })
    card!: Card;

    @Field(() => Int)
    @Property({ type: 'number' })
    quantity!: number;

    @Field(() => Date)
    @Property({ type: 'Date' })
    firstObtainedAt!: Date;
}
