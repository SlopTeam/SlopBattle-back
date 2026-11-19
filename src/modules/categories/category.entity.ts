import { Field, ObjectType } from '@nestjs/graphql';
import { Entity, Property } from '@mikro-orm/decorators/legacy';
import { BaseEntity } from '../base.entity';

@ObjectType()
@Entity({ tableName: 'categorie' })
export class CategoryEntity extends BaseEntity {

  @Field({ description: 'brainrot, meme fr…' })
  @Property({ type: 'string', unique: true })
  name!: string;
}
