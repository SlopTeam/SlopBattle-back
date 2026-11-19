import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { MikroORM } from '@mikro-orm/core';
import { ValidationPipe } from '@nestjs/common';
import type { NestExpressApplication } from '@nestjs/platform-express';
import { uploadDir } from './modules/media/media.storage';

async function bootstrap() {
  const app = await NestFactory.create<NestExpressApplication>(AppModule);

  // uploadMedia sends a base64 image of up to 2 MB, about 2.7 MB of JSON
  app.useBodyParser('json', { limit: '3mb' });

  // Uploaded files: unique names that never change, so browsers may cache them for good
  app.useStaticAssets(uploadDir(), {
    prefix: '/media/',
    index: false,
    immutable: true,
    maxAge: '1y',
    setHeaders: (res) => res.setHeader('X-Content-Type-Options', 'nosniff'),
  });

  // Apollo Sandbox runs on its own origin, so it needs CORS; CORS_ORIGINS (comma-separated) adds frontends.
  app.enableCors({
    origin: [...(process.env.CORS_ORIGINS?.split(',') ?? [])],
  });

  await app.get(MikroORM).migrator.up(); // Run migrations automatically on startup

  app.useGlobalPipes(new ValidationPipe({ whitelist: true }));
  
  await app.listen(process.env.PORT ?? 3000);
}
void bootstrap();
