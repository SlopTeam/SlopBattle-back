import { Migration } from '@mikro-orm/migrations';

export class Migration20261118105340_Boosters extends Migration {

  override name = 'Migration20261118105340_Boosters';

  override up(): void | Promise<void> {
    this.addSql(`create table "booster" ("id" serial primary key, "created_at" timestamptz not null, "updated_at" timestamptz not null, "name" varchar(255) not null, "type" varchar(255) not null, "price" int not null, "image_url" varchar(255) not null, "number_of_cards" int not null, "available_from" timestamptz not null, "available_until" timestamptz not null, "is_active" boolean not null);`);

    this.addSql(`create table "booster_cards" ("id" serial primary key, "created_at" timestamptz not null, "updated_at" timestamptz not null, "booster_id" int not null, "card_id" int not null, "is_banner" boolean not null, "drop_rate" int not null);`);

    this.addSql(`alter table "booster_cards" add constraint "booster_cards_booster_id_foreign" foreign key ("booster_id") references "booster" ("id");`);
    this.addSql(`alter table "booster_cards" add constraint "booster_cards_card_id_foreign" foreign key ("card_id") references "card" ("id");`);
  }

  override down(): void | Promise<void> {
    this.addSql(`drop table if exists "booster_cards" cascade;`);
    this.addSql(`drop table if exists "booster" cascade;`);
  }

}
