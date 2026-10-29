import { Field, Int, ObjectType } from '@nestjs/graphql';
import { Entity, ManyToMany, Property } from '@mikro-orm/decorators/legacy';
import { Collection } from '@mikro-orm/core';
import { BaseEntity } from '../base.entity';
import { CategoryEntity } from '../categories/category.entity';
import { CardTypeEntity } from '../types/type.entity';

@ObjectType()
@Entity()
export class Card extends BaseEntity {
  @Field()
  @Property({ type: 'string' })
  title!: string;

  @Field({ nullable: true })
  @Property({ type: 'text', nullable: true })
  description?: string;

  @Field({ description: 'CDN link' })
  @Property({ type: 'string' })
  imageUrl!: string;

  // ponytail: plain FK column until the Rarity entity exists, then turn it into a ManyToOne.
  @Field(() => Int)
  @Property({ type: 'number' })
  rarityId!: number;

  @Field(() => [CategoryEntity])
  @ManyToMany({
    entity: () => CategoryEntity,
    pivotTable: 'card_categories',
    joinColumn: 'card_id',
    inverseJoinColumn: 'category_id',
  })
  categories = new Collection<CategoryEntity>(this);

  @Field(() => [CardTypeEntity])
  @ManyToMany({
    entity: () => CardTypeEntity,
    pivotTable: 'type_categories',
    joinColumn: 'card_id',
    inverseJoinColumn: 'type_id',
  })
  types = new Collection<CardTypeEntity>(this);
}
