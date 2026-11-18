import { Entity, ManyToOne, Property } from "@mikro-orm/decorators/legacy";
import { BaseEntity } from "../../base.entity";
import { Field, Int, ObjectType } from "@nestjs/graphql";
import { BoosterEntity } from "./booster.entity";
import { RarityEntity } from "../../rarity/rarity.entity";

@ObjectType()
@Entity({ tableName: 'booster_rarity' })
export class BoosterRarityEntity extends BaseEntity {
    @ManyToOne({ entity: () => BoosterEntity, fieldName: 'booster_id' })
    booster!: BoosterEntity;
    
    @Field(() => RarityEntity)
    @ManyToOne({ entity: () => RarityEntity, fieldName: 'rarity_id' })
    rarity!: RarityEntity;

    @Field(() => Int)
    @Property({ type: 'number' })
    dropRate!: number;
}
