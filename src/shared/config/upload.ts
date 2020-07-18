import multer, { StorageEngine } from 'multer';
import path from 'path';
import crypto from 'crypto';

const tempDir = path.resolve(__dirname, '../', '../', 'temp', 'uploads');
const uploadsFolder = path.resolve(__dirname, '../', '../', 'temp', 'uploads');
interface IUploadConfig {
  driver: 's3' | 'disk';
  tempDir: string;
  uploadsFolder: string;
  config: {
    multer: {
      storage: StorageEngine;
    };
    aws: {
      bucket: string;
    };
  };
}

export default {
  driver: process.env.STORAGE_DRIVER,

  tempDir,
  uploadsFolder,
  config: {
    multer: {
      storage: multer.diskStorage({
        destination: tempDir,
        filename(request, file, callback) {
          const fileHash = crypto.randomBytes(10).toString('HEX');
          const fileName = `${fileHash}-${file.originalname}`;

          return callback(null, fileName);
        },
      }),
    },
    aws: {
      bucket: 'https://app-mrayone-go-barber.s3.amazonaws.com',
    },
  },
} as IUploadConfig;
