import { Entity, ManyToOne, Property } from "@mikro-orm/decorators/legacy";
import { BaseEntity } from "../../base.entity";
import { Field, Int, ObjectType } from "@nestjs/graphql";
import { BoosterEntity } from "./booster.entity";
import { Card } from "../../cards/card.entity";

@ObjectType()
@Entity({ tableName: 'booster_cards' })
export class BoosterCardsEntity extends BaseEntity {
    @ManyToOne({ entity: () => BoosterEntity, fieldName: 'booster_id' })
    booster!: BoosterEntity;
    
    @Field(() => Card)
    @ManyToOne({ entity: () => Card, fieldName: 'card_id' })
    card!: Card;

    @Field(() => Boolean)
    @Property({ type: 'boolean' })
    isBanner!: boolean;

    @Field(() => Int)
    @Property({ type: 'number', nullable: true })
    dropRate?: number;
}
