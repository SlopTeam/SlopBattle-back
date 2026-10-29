import { Migration } from '@mikro-orm/migrations';

export class Migration20261029100000_TypesCategoriesBaseEntity extends Migration {

  override name = 'Migration20261029100000_TypesCategoriesBaseEntity';

  override up(): void | Promise<void> {
    for (const table of ['type', 'categorie']) {
      this.addSql(`alter table "${table}" add "created_at" timestamptz not null default now(), add "updated_at" timestamptz not null default now();`);
      this.addSql(`alter table "${table}" alter column "created_at" drop default, alter column "updated_at" drop default;`);
    }
  }

  override down(): void | Promise<void> {
    for (const table of ['type', 'categorie']) {
      this.addSql(`alter table "${table}" drop column "created_at", drop column "updated_at";`);
    }
  }

}
