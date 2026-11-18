import { Collection } from "@mikro-orm/core";
import { Entity, OneToMany, Property } from "@mikro-orm/decorators/legacy";
import { Field, Int, ObjectType } from "@nestjs/graphql";
import { BaseEntity } from "../base.entity";
import { Card } from "../cards/card.entity";

@ObjectType()
@Entity({ tableName: 'rarity' })
export class RarityEntity extends BaseEntity {
    @Field(() => String)
    @Property({ type: 'string' })
    name!: string;

    @Field(() => Int, { nullable: true })
    @Property({ type: 'number', nullable: true })
    sortOrder?: number;

    @OneToMany({ entity: () => Card, mappedBy: (card: Card) => card.rarity })
    cards = new Collection<Card>(this);
}
