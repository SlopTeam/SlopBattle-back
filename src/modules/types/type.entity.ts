import { Field, ObjectType } from '@nestjs/graphql';
import { Entity, Property } from '@mikro-orm/decorators/legacy';
import { BaseEntity } from '../base.entity';

@ObjectType()
@Entity({ tableName: 'type' })
export class CardTypeEntity extends BaseEntity {

  @Field()
  @Property({ type: 'string', unique: true })
  name!: string;
}
