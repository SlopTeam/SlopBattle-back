import { Field, ID, Int, ObjectType } from '@nestjs/graphql';
import { Entity, PrimaryKey, Property } from '@mikro-orm/decorators/legacy';
import type { Opt } from '@mikro-orm/core';

@ObjectType()
@Entity()
export class BaseEntity {
  @Field(() => ID)
  @PrimaryKey({ type: 'number' })
  id!: number;

  @Field(() => Date)
  @Property({ type: 'Date', onCreate: () => new Date() })
  createdAt: Opt<Date> = new Date();

  @Field(() => Date)
  @Property({ type: 'Date', onUpdate: () => new Date() })
  updatedAt: Opt<Date> = new Date();
}
