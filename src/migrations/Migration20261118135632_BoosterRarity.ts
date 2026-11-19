import { Migration } from '@mikro-orm/migrations';

export class Migration20261118135632_BoosterRarity extends Migration {

  override name = 'Migration20261118135632_BoosterRarity';

  override up(): void | Promise<void> {
    this.addSql(`create table "booster_rarity" ("id" serial primary key, "created_at" timestamptz not null, "updated_at" timestamptz not null, "booster_id" int not null, "rarity_id" int not null, "drop_rate" int not null);`);

    this.addSql(`alter table "booster_rarity" add constraint "booster_rarity_booster_id_foreign" foreign key ("booster_id") references "booster" ("id");`);
    this.addSql(`alter table "booster_rarity" add constraint "booster_rarity_rarity_id_foreign" foreign key ("rarity_id") references "rarity" ("id");`);
  }

  override down(): void | Promise<void> {
    this.addSql(`drop table if exists "booster_rarity" cascade;`);
  }

}
