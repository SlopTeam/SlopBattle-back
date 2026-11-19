import { jest } from '@jest/globals';
import { MediaResolver } from '../media.resolver';
import type { MediaService } from '../media.service';
import type { Media } from '../media.entity';

describe('MediaResolver', () => {
  let resolver: MediaResolver;
  const service = { upload: jest.fn<(...args: any[]) => any>() };

  beforeEach(() => {
    jest.resetAllMocks();
    resolver = new MediaResolver(service as unknown as MediaService);
  });

  afterEach(() => {
    delete process.env.PUBLIC_URL;
  });

  it('uploadMedia delegates to upload', async () => {
    const input = { data: 'AA==', mimeType: 'image/png' };
    const media = { id: 1 };
    service.upload.mockResolvedValue(media);
    await expect(resolver.uploadMedia(input)).resolves.toBe(media);
    expect(service.upload).toHaveBeenCalledWith(input);
  });

  it('url prefixes the key with PUBLIC_URL, without doubling the slash', () => {
    process.env.PUBLIC_URL = 'https://slop.example/';
    expect(resolver.url({ key: 'a.png' } as Media)).toBe(
      'https://slop.example/media/a.png',
    );
  });

  it('url stays relative without PUBLIC_URL', () => {
    expect(resolver.url({ key: 'a.png' } as Media)).toBe('/media/a.png');
  });
});
