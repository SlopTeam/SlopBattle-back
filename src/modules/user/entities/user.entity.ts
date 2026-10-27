import { Entity, Property } from "@mikro-orm/decorators/legacy";
import { BaseEntity } from "../../base.entity";

@Entity()
export class User extends BaseEntity {
  @Property({ type: 'string', unique: true })
  email!: string;

  @Property({ type: 'string', nullable: true, hidden: true })
  passwordHash: string | null = null; // null si compte Google uniquement

  @Property({ type: 'string', nullable: true, unique: true, hidden: true })
  googleId: string | null = null; // null si compte e-mail/mot de passe uniquement

  @Property({ type: 'string', length: 30, nullable: true, unique: true })
  username: string | null = null;

  @Property({ type: 'string', length: 2048, nullable: true })
  avatarUrl: string | null = null;

  @Property({ type: 'number', default: 0 })
  coins = 0;
}

