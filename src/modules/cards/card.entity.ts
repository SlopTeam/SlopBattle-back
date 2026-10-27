import { Field, Int, ObjectType } from '@nestjs/graphql';
import { Entity, Property } from '@mikro-orm/decorators/legacy';
import { BaseEntity } from '../base.entity';

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
}
