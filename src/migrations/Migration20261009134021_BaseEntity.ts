import { Migration } from '@mikro-orm/migrations';

export class Migration20261009134021_BaseEntity extends Migration {

  override name = 'Migration20261009134021_BaseEntity';

  override up(): void | Promise<void> {
    this.addSql(`create table "base_entity" ("id" serial primary key, "created_at" timestamptz not null, "updated_at" timestamptz not null);`);

    this.addSql(`alter table "card" add "updated_at" timestamptz not null;`);
  }

  override down(): void | Promise<void> {
    this.addSql(`drop table if exists "base_entity" cascade;`);

    this.addSql(`alter table "card" drop column "updated_at";`);
  }

}
