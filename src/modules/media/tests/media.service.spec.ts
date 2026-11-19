import { jest } from '@jest/globals';
import { mkdtemp, readdir, readFile, rm } from 'node:fs/promises';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { MediaService } from '../media.service';
import { Media } from '../media.entity';
import { MAX_MEDIA_SIZE } from '../media.storage';

const PNG = Buffer.from('89504e470d0a1a0a0000000d49484452', 'hex');
const JPEG = Buffer.from('ffd8ffe000104a464946', 'hex');
const WEBP = Buffer.concat([
  Buffer.from('RIFF'),
  Buffer.alloc(4),
  Buffer.from('WEBPVP8 '),
]);

describe('MediaService', () => {
  let service: MediaService;
  let dir: string;
  const em = {
    create: jest.fn<(...args: any[]) => any>(),
    flush: jest.fn<(...args: any[]) => any>(),
  };

  beforeEach(async () => {
    jest.resetAllMocks();
    em.create.mockImplementation((_entity, data) => data);
    dir = await mkdtemp(join(tmpdir(), 'media-'));
    process.env.UPLOAD_DIR = dir;
    service = new MediaService(em as any);
  });

  afterEach(async () => {
    delete process.env.UPLOAD_DIR;
    await rm(dir, { recursive: true, force: true });
  });

  it.each([
    ['image/png', PNG, 'png'],
    ['image/jpeg', JPEG, 'jpg'],
    ['image/webp', WEBP, 'webp'],
  ])('stores a %s file and its row', async (mimeType, bytes, ext) => {
    const media = await service.upload({
      data: bytes.toString('base64'),
      mimeType,
    });

    expect(media.key).toMatch(new RegExp(`^[0-9a-f-]{36}\\.${ext}$`));
    expect(em.create).toHaveBeenCalledWith(Media, {
      key: media.key,
      mimeType,
      size: bytes.length,
    });
    expect(em.flush).toHaveBeenCalledTimes(1);
    await expect(readFile(join(dir, media.key))).resolves.toEqual(bytes);
  });

  it('rejects a file that is not the announced format', async () => {
    await expect(
      service.upload({ data: JPEG.toString('base64'), mimeType: 'image/png' }),
    ).rejects.toThrow("Le fichier n'est pas une image du format annoncé.");
    await expect(readdir(dir)).resolves.toEqual([]);
    expect(em.flush).not.toHaveBeenCalled();
  });

  it('rejects an unsupported type', async () => {
    await expect(
      service.upload({
        data: PNG.toString('base64'),
        mimeType: 'image/svg+xml',
      }),
    ).rejects.toThrow('Format accepté : PNG, JPEG ou WebP.');
  });

  it('rejects an empty or too large file', async () => {
    await expect(
      service.upload({ data: '', mimeType: 'image/png' }),
    ).rejects.toThrow("L'image doit faire au plus 2 Mo.");

    const big = Buffer.concat([PNG, Buffer.alloc(MAX_MEDIA_SIZE)]);
    await expect(
      service.upload({ data: big.toString('base64'), mimeType: 'image/png' }),
    ).rejects.toThrow("L'image doit faire au plus 2 Mo.");
    await expect(readdir(dir)).resolves.toEqual([]);
  });

  it('removes the file when the row cannot be saved', async () => {
    em.flush.mockRejectedValue(new Error('db down'));
    await expect(
      service.upload({ data: PNG.toString('base64'), mimeType: 'image/png' }),
    ).rejects.toThrow('db down');
    await expect(readdir(dir)).resolves.toEqual([]);
  });
});
