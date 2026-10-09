import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { MikroORM } from '@mikro-orm/core';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // Apollo Sandbox runs on its own origin, so it needs CORS; CORS_ORIGINS (comma-separated) adds frontends.
  app.enableCors({
    origin: [
      'https://studio.apollographql.com',
      ...(process.env.CORS_ORIGINS?.split(',') ?? []),
    ],
  });

  await app.get(MikroORM).migrator.up(); // Run migrations automatically on startup

  await app.listen(process.env.PORT ?? 3000);
}
void bootstrap();
