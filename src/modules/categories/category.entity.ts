import { Field, ID, ObjectType } from '@nestjs/graphql';
import { Entity, PrimaryKey, Property } from '@mikro-orm/decorators/legacy';

@ObjectType()
@Entity({ tableName: 'categorie' })
export class Category {
  @Field(() => ID)
  @PrimaryKey({ type: 'number' })
  id!: number;

  @Field({ description: 'brainrot, meme fr…' })
  @Property({ type: 'string', unique: true })
  name!: string;
}
