import { Migration } from '@mikro-orm/migrations';

export class Migration20261029140505_Admin extends Migration {

  override name = 'Migration20261029140505_Admin';

  override up(): void | Promise<void> {
    this.addSql(`create table "admin" ("id" serial primary key, "created_at" timestamptz not null, "updated_at" timestamptz not null, "email" varchar(255) not null, "password_hash" varchar(255) not null);`);
    this.addSql(`alter table "admin" add constraint "admin_email_unique" unique ("email");`);
  }

  override down(): void | Promise<void> {
    this.addSql(`drop table if exists "admin" cascade;`);
  }

}
