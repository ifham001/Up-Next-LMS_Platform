import { Storage} from '@google-cloud/storage';
import path from 'path';


// Get __dirname equivalent in ES Modules


// Use relative path from current file to JSON key
const keyPath: string = path.resolve(__dirname, '../../google_keys.json');

export const storage: Storage = new Storage({
  keyFilename: keyPath,
  projectId: 'deploy-4abde',
});

export const bucket = storage.bucket('lms-platform12');

