import { resolve } from 'node:path';

export const MAX_MEDIA_SIZE = 2 * 1024 * 1024;

/** Accepted image types, with their extension and the first bytes of a real file. */
export const MEDIA_FORMATS = {
  'image/png': {
    ext: 'png',
    matches: (b: Buffer) =>
      b.subarray(0, 8).equals(Buffer.from('89504e470d0a1a0a', 'hex')),
  },
  'image/jpeg': {
    ext: 'jpg',
    matches: (b: Buffer) =>
      b.subarray(0, 3).equals(Buffer.from('ffd8ff', 'hex')),
  },
  'image/webp': {
    ext: 'webp',
    matches: (b: Buffer) =>
      b.toString('latin1', 0, 4) === 'RIFF' &&
      b.toString('latin1', 8, 12) === 'WEBP',
  },
} as const;

export type MediaType = keyof typeof MEDIA_FORMATS;
export const MEDIA_TYPES = Object.keys(MEDIA_FORMATS) as MediaType[];

/** Where files are written and served from; a Docker volume in deployed stacks (/app/uploads). */
export const uploadDir = () => resolve(process.env.UPLOAD_DIR || 'uploads');

/**
 * Public URL of a stored file. PUBLIC_URL is the origin the browsers reach the back on;
 * without it the URL stays relative, which only works on the front's own origin.
 */
export const mediaUrl = (key: string) =>
  `${(process.env.PUBLIC_URL ?? '').replace(/\/+$/, '')}/media/${key}`;
