import { Field, ID, Int, ObjectType } from '@nestjs/graphql';
import { Entity, PrimaryKey, Property } from '@mikro-orm/decorators/legacy';
import type { Opt } from '@mikro-orm/core';

@ObjectType()
@Entity()
export class Card {
  @Field(() => ID)
  @PrimaryKey({ type: 'number' })
  id!: number;

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

  @Field(() => Date)
  @Property({ type: 'Date', onCreate: () => new Date() })
  createdAt: Opt<Date> = new Date();
}
