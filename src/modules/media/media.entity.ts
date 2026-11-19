import { Field, Int, ObjectType } from '@nestjs/graphql';
import { Entity, Property } from '@mikro-orm/decorators/legacy';
import { BaseEntity } from '../base.entity';

/** An uploaded file, stored in UPLOAD_DIR and served under /media/<key>. */
@ObjectType()
@Entity({ tableName: 'media' })
export class Media extends BaseEntity {
  /** File name in UPLOAD_DIR (`<uuid>.<ext>`). The URL is built from it, never stored. */
  @Property({ type: 'string', unique: true })
  key!: string;

  @Field()
  @Property({ type: 'string' })
  mimeType!: string;

  @Field(() => Int, { description: 'Size in bytes' })
  @Property({ type: 'number' })
  size!: number;
}
