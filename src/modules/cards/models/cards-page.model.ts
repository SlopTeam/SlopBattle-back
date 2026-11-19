import { Field, Int, ObjectType, registerEnumType } from '@nestjs/graphql';
import { Card } from '../card.entity';

export enum CardSort {
  TITLE_ASC = 'TITLE_ASC',
  TITLE_DESC = 'TITLE_DESC',
  RARITY_DESC = 'RARITY_DESC',
  NEWEST = 'NEWEST',
}

registerEnumType(CardSort, { name: 'CardSort' });

@ObjectType()
export class CardsPage {
  @Field(() => [Card])
  items!: Card[];

  @Field(() => Int, { description: 'Cards matching the filter, all pages' })
  total!: number;

  @Field(() => Int, { description: '1-based' })
  page!: number;

  @Field(() => Int)
  pageSize!: number;

  @Field(() => Int, { description: 'At least 1, even when there is no card' })
  pageCount!: number;
}
