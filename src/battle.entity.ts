import { Entity, PrimaryKey, Property } from '@mikro-orm/decorators/legacy';

// Placeholder: MikroORM refuses to boot with zero entities. Replace with real ones.
@Entity()
export class Battle {
  @PrimaryKey({ type: 'number' })
  id!: number;

  @Property({ type: 'string' })
  name!: string;
}
