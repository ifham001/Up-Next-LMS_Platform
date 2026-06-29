import { Storage, Bucket } from '@google-cloud/storage';
import path from 'path';
import fs from 'fs';

// Get __dirname equivalent in ES Modules
import { fileURLToPath } from 'url';
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Use relative path from current file to JSON key
const keyPath: string = path.resolve(__dirname, '../../google_keys.json');

// Lazily construct the GCS client so the server can boot WITHOUT Google
// credentials (e.g. local dev). The credential check only runs the first time
// GCS is actually used (video/resource uploads), instead of at import time.
let _storage: Storage | null = null;
let _bucket: Bucket | null = null;

function getStorage(): Storage {
  if (_storage) return _storage;

  if (process.env.GOOGLE_APPLICATION_CREDENTIALS_JSON) {
    // Railway: parse credentials from env var
    const credentials = JSON.parse(process.env.GOOGLE_APPLICATION_CREDENTIALS_JSON);
    _storage = new Storage({ projectId: 'deploy-4abde', credentials });
  } else if (fs.existsSync(keyPath)) {
    // Local: use key file
    _storage = new Storage({ projectId: 'deploy-4abde', keyFilename: keyPath });
  } else {
    throw new Error(
      "No Google Cloud credentials found (neither GOOGLE_APPLICATION_CREDENTIALS_JSON nor google_keys.json). " +
      "GCS-backed features (video/resource upload) are unavailable until credentials are provided."
    );
  }
  return _storage;
}

function getBucket(): Bucket {
  if (!_bucket) _bucket = getStorage().bucket('lms-platform12');
  return _bucket;
}

// Preserve the original named exports (`storage`, `bucket`) but resolve them
// lazily via property getters, so merely importing this module never throws.
export const storage = new Proxy({} as Storage, {
  get(_t, prop) {
    const s = getStorage() as unknown as Record<string | symbol, unknown>;
    const v = s[prop];
    return typeof v === 'function' ? (v as (...a: unknown[]) => unknown).bind(s) : v;
  },
});

export const bucket = new Proxy({} as Bucket, {
  get(_t, prop) {
    const b = getBucket() as unknown as Record<string | symbol, unknown>;
    const v = b[prop];
    return typeof v === 'function' ? (v as (...a: unknown[]) => unknown).bind(b) : v;
  },
});
