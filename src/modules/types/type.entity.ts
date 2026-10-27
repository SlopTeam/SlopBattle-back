import { Field, ID, ObjectType } from '@nestjs/graphql';
import { Entity, PrimaryKey, Property } from '@mikro-orm/decorators/legacy';

@ObjectType()
@Entity({ tableName: 'type' })
export class CardType {
  @Field(() => ID)
  @PrimaryKey({ type: 'number' })
  id!: number;

  @Field()
  @Property({ type: 'string', unique: true })
  name!: string;
}
