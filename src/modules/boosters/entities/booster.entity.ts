import { Field, Int, ObjectType } from "@nestjs/graphql";
import { BaseEntity } from "../../base.entity";
import { Entity, Property } from "@mikro-orm/decorators/legacy";

@ObjectType()
@Entity({ tableName: 'booster' })
export class BoosterEntity extends BaseEntity {
    @Field(() => String)
    @Property({ type: 'string' })
    name!: string;

    @Field(() => String)
    @Property({ type: 'string' })
    type!: string;

    @Field(() => Int)
    @Property({ type: 'number' })
    price!: number;

    @Field(() => String)
    @Property({ type: 'string' })
    imageUrl!: string;

    @Field(() => Int)
    @Property({ type: 'number' })
    numberOfCards!: number;

    @Field(() => Date)
    @Property({ type: 'Date' })
    availableFrom!: Date;

    @Field(() => Date)
    @Property({ type: 'Date' })
    availableUntil!: Date;

    @Field(() => Boolean)
    @Property({ type: 'boolean' })
    isActive!: boolean;
}
