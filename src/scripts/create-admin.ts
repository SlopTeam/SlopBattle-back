import { MikroORM } from '@mikro-orm/postgresql';
import config from '../mikro.config';
import { Admin } from '../modules/admin/entities/admin.entity';
import { hashPassword } from '../modules/auth/password';

// Creates a back-office account. There is no GraphQL mutation for this on purpose.
// Usage (after `npm run build`): npm run admin:create -- <email> <password>
// In the container: node dist/scripts/create-admin.js <email> <password>

async function main(): Promise<void> {
  const [email, password] = process.argv.slice(2);
  if (!email || !password) {
    console.error('Usage : npm run admin:create -- <email> <mot de passe>');
    process.exit(1);
  }
  if (password.length < 8) {
    console.error('Le mot de passe doit faire au moins 8 caractères.');
    process.exit(1);
  }

  const orm = await MikroORM.init({ ...config, debug: false });
  try {
    const em = orm.em.fork();
    const normalizedEmail = email.trim().toLowerCase();
    if (await em.findOne(Admin, { email: normalizedEmail })) {
      console.error(`Un admin ${normalizedEmail} existe déjà.`);
      process.exitCode = 1;
      return;
    }
    em.create(Admin, {
      email: normalizedEmail,
      passwordHash: await hashPassword(password),
    });
    await em.flush();
    console.log(`Admin ${normalizedEmail} créé.`);
  } finally {
    await orm.close();
  }
}

void main();
