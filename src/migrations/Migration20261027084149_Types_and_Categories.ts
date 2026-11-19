import { Migration } from '@mikro-orm/migrations';

export class Migration20261027084149_Types_and_Categories extends Migration {

  override name = 'Migration20261027084149_Types_and_Categories';

  override up(): void | Promise<void> {
    this.addSql(`create table "type" ("id" serial primary key, "name" varchar(255) not null);`);
    this.addSql(`alter table "type" add constraint "type_name_unique" unique ("name");`);

    this.addSql(`create table "categorie" ("id" serial primary key, "name" varchar(255) not null);`);
    this.addSql(`alter table "categorie" add constraint "categorie_name_unique" unique ("name");`);

    this.addSql(`create table "card_categories" ("card_id" int not null, "category_id" int not null, primary key ("card_id", "category_id"));`);

    this.addSql(`create table "type_categories" ("card_id" int not null, "type_id" int not null, primary key ("card_id", "type_id"));`);

    this.addSql(`alter table "card_categories" add constraint "card_categories_card_id_foreign" foreign key ("card_id") references "card" ("id") on update cascade on delete cascade;`);
    this.addSql(`alter table "card_categories" add constraint "card_categories_category_id_foreign" foreign key ("category_id") references "categorie" ("id") on update cascade on delete cascade;`);

    this.addSql(`alter table "type_categories" add constraint "type_categories_card_id_foreign" foreign key ("card_id") references "card" ("id") on update cascade on delete cascade;`);
    this.addSql(`alter table "type_categories" add constraint "type_categories_type_id_foreign" foreign key ("type_id") references "type" ("id") on update cascade on delete cascade;`);
  }

  override down(): void | Promise<void> {
    this.addSql(`alter table "type_categories" drop constraint "type_categories_type_id_foreign";`);
    this.addSql(`alter table "card_categories" drop constraint "card_categories_category_id_foreign";`);

    this.addSql(`drop table if exists "type" cascade;`);
    this.addSql(`drop table if exists "categorie" cascade;`);
    this.addSql(`drop table if exists "card_categories" cascade;`);
    this.addSql(`drop table if exists "type_categories" cascade;`);
  }

}
