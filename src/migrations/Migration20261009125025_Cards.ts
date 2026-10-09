import { Migration } from '@mikro-orm/migrations';

export class Migration20261009125025_Cards extends Migration {

  override name = 'Migration20261009125025_Cards';

  override up(): void | Promise<void> {
    this.addSql(`create table "card" ("id" serial primary key, "title" varchar(255) not null, "description" text null, "image_url" varchar(255) not null, "rarity_id" int not null, "created_at" timestamptz not null);`);
  }

  override down(): void | Promise<void> {
    this.addSql(`drop table if exists "card" cascade;`);
  }

}
