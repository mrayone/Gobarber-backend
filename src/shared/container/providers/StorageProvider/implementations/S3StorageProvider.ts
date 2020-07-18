import fs from 'fs';
import path from 'path';
import aws, { S3 } from 'aws-sdk';
import mime from 'mime';
import uploadConfig from '@shared/config/upload';
import IStorageProvider from '../models/IStorageProvider';

class S3StorageProvider implements IStorageProvider {
  private client: S3;

  constructor() {
    this.client = new aws.S3({
      region: 'us-east-1',
    });
  }

  public async saveFile(file: string): Promise<string> {
    const originalPath = path.resolve(uploadConfig.tempDir, file);

    const fileContent = await fs.promises.readFile(originalPath);

    const ContentType = mime.getType(originalPath);

    if (!ContentType) {
      throw new Error('File not found');
    }

    await this.client
      .putObject({
        Bucket: 'app-mrayone-go-barber',
        Key: file,
        ACL: 'public-read',
        Body: fileContent,
        ContentType,
      })
      .promise();

    try {
      await fs.promises.stat(originalPath);
      await fs.promises.unlink(originalPath);
    } catch (error) {
      console.log(error);
    }

    return file;
  }

  public async deleteFile(file: string): Promise<void> {
    await this.client
      .deleteObject({
        Bucket: 'app-mrayone-go-barber',
        Key: file,
      })
      .promise();
  }
}

export default S3StorageProvider;
