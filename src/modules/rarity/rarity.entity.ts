import { Entity, Property } from "@mikro-orm/decorators/legacy";
import { Field, Int, ObjectType } from "@nestjs/graphql";
import { BaseEntity } from "../base.entity";

@ObjectType()
@Entity({ tableName: 'rarity' })
export class RarityEntity extends BaseEntity {
    @Field(() => String)
    @Property({ type: 'string' })
    name!: string;

    @Field(() => Int, { nullable: true })
    @Property({ type: 'number', nullable: true })
    sortOrder?: number;
}
