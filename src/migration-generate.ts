import { exec } from 'child_process';

// Récupérer l'argument (nom de la migration) passé à la commande
const migrationName: string | undefined = process.argv[2];

if (!migrationName) {
  console.error('Vous devez spécifier un nom de migration.');
  process.exit(1);
}

// La commande de génération de migration
const command = `npm run build && npx mikro-orm migration:create --name ${migrationName}`;

exec(command, (error, stdout, stderr) => {
  if (error) {
    console.error(
      `Erreur lors de l'exécution de la commande: ${error.message}`,
    );
    process.exit(1);
  }
  if (stderr) {
    // npx/mikro-orm may output warnings to stderr, but still succeed
    console.error(`stderr: ${stderr}`);
  }
  if (stdout) {
    console.log(`stdout: ${stdout}`);
  }
});