import { existsSync } from 'node:fs';
import { MikroOrmModuleSyncOptions } from '@mikro-orm/nestjs';
import { PostgreSqlDriver } from '@mikro-orm/postgresql';
import { Migrator } from '@mikro-orm/migrations';

// The CLI runs this file outside Nest, so .env must be loaded here too.
if (existsSync('.env')) process.loadEnvFile();

const config: MikroOrmModuleSyncOptions = {
  driver: PostgreSqlDriver,
  dbName: process.env.DB_NAME,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  host: process.env.DB_HOST,
  port: Number(process.env.DB_PORT),
  entities: ['dist/modules/**/*.entity.js'],
  entitiesTs: ['src/modules/**/*.entity.ts'],
  migrations: {
    tableName: 'mikro_orm_migrations',
    path: './dist/migrations',
    pathTs: './src/migrations',
    snapshot: true,
    transactional: true,
    allOrNothing: true,
    emit: 'ts',
  },
  extensions: [Migrator],
  debug: process.env.NODE_ENV === 'development',
};

export default config;
