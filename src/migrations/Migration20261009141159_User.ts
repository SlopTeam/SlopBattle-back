import { Migration } from '@mikro-orm/migrations';

export class Migration20261009141159_User extends Migration {

  override name = 'Migration20261009141159_User';

  override up(): void | Promise<void> {
    this.addSql(`create table "user" ("id" serial primary key, "email" varchar(255) not null, "password_hash" varchar(255) null, "google_id" varchar(255) null, "username" varchar(30) null, "avatar_url" varchar(2048) null, "coins" int not null default 0, "created_at" date not null);`);
    this.addSql(`alter table "user" add constraint "user_email_unique" unique ("email");`);
    this.addSql(`alter table "user" add constraint "user_google_id_unique" unique ("google_id");`);
    this.addSql(`alter table "user" add constraint "user_username_unique" unique ("username");`);
  }

  override down(): void | Promise<void> {
    this.addSql(`drop table if exists "user" cascade;`);
  }

}
