import { Entity, Property } from '@mikro-orm/decorators/legacy';
import { BaseEntity } from '../../base.entity';

/** Back-office account. Not linked to any other table: a player account never gets admin rights. */
@Entity()
export class Admin extends BaseEntity {
  @Property({ type: 'string', unique: true })
  email!: string;

  @Property({ type: 'string', hidden: true })
  passwordHash!: string;
}
