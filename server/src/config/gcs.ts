import { Storage } from '@google-cloud/storage';
import path from 'path';
import fs from 'fs';

// Get __dirname equivalent in ES Modules
import { fileURLToPath } from 'url';
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Use relative path from current file to JSON key
const keyPath: string = path.resolve(__dirname, '../../google_keys.json');

// Check if env var exists (Railway) or fall back to local file
let storage: Storage;

if (process.env.GOOGLE_APPLICATION_CREDENTIALS_JSON) {
  // Railway: parse credentials from env var
  const credentials = JSON.parse(process.env.GOOGLE_APPLICATION_CREDENTIALS_JSON);
  storage = new Storage({
    projectId: 'deploy-4abde',
    credentials,
  });
} else if (fs.existsSync(keyPath)) {
  // Local: use key file
  storage = new Storage({
    projectId: 'deploy-4abde',
    keyFilename: keyPath,
  });
} else {
  throw new Error("No Google Cloud credentials found (neither env var nor local file)");
}

export { storage };

export const bucket = storage.bucket('lms-platform12');
