import { Entity, PrimaryKey, Property } from "@mikro-orm/decorators/legacy";

//TODO: Ajouter les champs username, avatarUrl, coins, etc ...
@Entity()
export class User {
  @PrimaryKey({ type: 'number' })
  id: number;

  @Property({ type: 'string', unique: true })
  email!: string;

  @Property({ type: 'string', nullable: true, hidden: true })
  passwordHash: string | null = null; // null si compte Google uniquement

  @Property({ type: 'string', nullable: true, unique: true })
  googleId: string | null = null;

  @Property({ type: 'date' })
  createdAt: Date = new Date();
}
