import { randomUUID } from 'node:crypto';
import { mkdir, rm, writeFile } from 'node:fs/promises';
import { join } from 'node:path';
import { BadRequestException, Injectable } from '@nestjs/common';
import { EntityManager } from '@mikro-orm/postgresql';
import { Media } from './media.entity';
import { UploadMediaInput } from './dto/media.inputs';
import {
  MAX_MEDIA_SIZE,
  MEDIA_FORMATS,
  type MediaType,
  uploadDir,
} from './media.storage';

@Injectable()
export class MediaService {
  constructor(private readonly em: EntityManager) {}

  async upload({ data, mimeType }: UploadMediaInput) {
    const format = MEDIA_FORMATS[mimeType as MediaType];
    const bytes = Buffer.from(data, 'base64');
    if (!format) {
      throw new BadRequestException('Format accepté : PNG, JPEG ou WebP.');
    }
    if (bytes.length === 0 || bytes.length > MAX_MEDIA_SIZE) {
      throw new BadRequestException("L'image doit faire au plus 2 Mo.");
    }
    if (!format.matches(bytes)) {
      throw new BadRequestException(
        "Le fichier n'est pas une image du format annoncé.",
      );
    }

    const key = `${randomUUID()}.${format.ext}`;
    const path = join(uploadDir(), key);
    await mkdir(uploadDir(), { recursive: true });
    await writeFile(path, bytes, { flag: 'wx' });

    const media = this.em.create(Media, { key, mimeType, size: bytes.length });
    try {
      await this.em.flush();
    } catch (error) {
      // no row, no file: never leave an unreferenced file behind
      await rm(path, { force: true });
      throw error;
    }
    return media;
  }
}
