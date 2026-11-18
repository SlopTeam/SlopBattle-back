import { Migration } from '@mikro-orm/migrations';

export class Migration20261118132800_Rarity extends Migration {

  override name = 'Migration20261118132800_Rarity';

  override up(): void | Promise<void> {
    this.addSql(`create table "rarity" ("id" serial primary key, "created_at" timestamptz not null, "updated_at" timestamptz not null, "name" varchar(255) not null, "sort_order" int null);`);

    this.addSql(`alter table "booster_cards" alter column "drop_rate" drop not null;`);
  }

  override down(): void | Promise<void> {
    this.addSql(`drop table if exists "rarity" cascade;`);

    this.addSql(`alter table "booster_cards" alter column "drop_rate" set not null;`);
  }

}
