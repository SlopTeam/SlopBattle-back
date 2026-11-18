import { Migration } from '@mikro-orm/migrations';

export class Migration20261118134116_CardRarity extends Migration {

  override name = 'Migration20261118134116_CardRarity';

  override up(): void | Promise<void> {
    this.addSql(`alter table "card" add constraint "card_rarity_id_foreign" foreign key ("rarity_id") references "rarity" ("id");`);
  }

  override down(): void | Promise<void> {
    this.addSql(`alter table "card" drop constraint "card_rarity_id_foreign";`);
  }

}
