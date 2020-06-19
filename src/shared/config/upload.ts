import multer from 'multer';
import path from 'path';
import crypto from 'crypto';

const tempDir = path.resolve(__dirname, '../', '../', 'temp');
export default {
  homeDirectory: tempDir,
  storage: multer.diskStorage({
    destination: tempDir,
    filename(request, file, callback) {
      const fileHash = crypto.randomBytes(10).toString('HEX');
      const fileName = `${fileHash}-${file.originalname}`;

      return callback(null, fileName);
    },
  }),
};
