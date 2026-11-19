import { Migration } from '@mikro-orm/migrations';

export class Migration20261027111115_UserUpdatedAt extends Migration {

  override name = 'Migration20261027111115_UserUpdatedAt';

  override up(): void | Promise<void> {
    this.addSql(`alter table "user" add "updated_at" timestamptz not null default now();`);
    this.addSql(`alter table "user" alter column "updated_at" drop default;`);
    this.addSql(`alter table "user" alter column "created_at" type timestamptz using ("created_at"::timestamptz);`);
  }

  override down(): void | Promise<void> {
    this.addSql(`alter table "user" drop column "updated_at";`);
    this.addSql(`alter table "user" alter column "created_at" type date using ("created_at"::date);`);
  }

}
