import { Migration } from '@mikro-orm/migrations';

export class Migration20261029110000_UserCards extends Migration {

  override name = 'Migration20261029110000_UserCards';

  override up(): void | Promise<void> {
    this.addSql(`create table "user_cards" ("id" serial primary key, "created_at" timestamptz not null, "updated_at" timestamptz not null, "user_id" int not null, "card_id" int not null, "quantity" int not null, "first_obtained_at" timestamptz not null);`);

    this.addSql(`alter table "user_cards" add constraint "user_cards_user_id_foreign" foreign key ("user_id") references "user" ("id") on update cascade;`);
    this.addSql(`alter table "user_cards" add constraint "user_cards_card_id_foreign" foreign key ("card_id") references "card" ("id") on update cascade;`);
  }

  override down(): void | Promise<void> {
    this.addSql(`drop table if exists "user_cards" cascade;`);
  }

}
