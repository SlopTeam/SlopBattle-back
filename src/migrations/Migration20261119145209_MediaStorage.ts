import { Migration } from '@mikro-orm/migrations';

export class Migration20261119145209_MediaStorage extends Migration {

  override name = 'Migration20261119145209_MediaStorage';

  override up(): void | Promise<void> {
    this.addSql(`create table "media" ("id" serial primary key, "created_at" timestamptz not null, "updated_at" timestamptz not null, "key" varchar(255) not null, "mime_type" varchar(255) not null, "size" int not null);`);
    this.addSql(`alter table "media" add constraint "media_key_unique" unique ("key");`);

    this.addSql(`alter table "card" add "media_id" int null;`);
    this.addSql(`alter table "card" add constraint "card_media_id_foreign" foreign key ("media_id") references "media" ("id") on delete set null;`);
    this.addSql(`alter table "card" alter column "image_url" drop not null;`);
  }

  override down(): void | Promise<void> {
    this.addSql(`alter table "card" drop constraint "card_media_id_foreign";`);

    this.addSql(`drop table if exists "media" cascade;`);

    this.addSql(`alter table "card" drop column "media_id";`);
    // cards that only had a media lose their image instead of blocking the rollback
    this.addSql(`update "card" set "image_url" = '' where "image_url" is null;`);
    this.addSql(`alter table "card" alter column "image_url" set not null;`);
  }

}
