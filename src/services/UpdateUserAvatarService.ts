import { getRepository } from 'typeorm';
import fs from 'fs';
import path from 'path';
import AppError from '../errors/AppError';

import uploadConfig from '../config/upload';
import User from '../models/User';

interface Request {
  user_id: string;
  avatarFileName: string;
}

class UpdateUserAvatarService {
  public async execute({ user_id, avatarFileName }: Request): Promise<User> {
    const userRepository = getRepository(User);
    const user = await userRepository.findOne(user_id);

    if (!user) {
      throw new AppError(
        'Can only authenticated users change avatar image.',
        401,
      );
    }

    if (user.avatar) {
      const userAvatarFilePath = path.resolve(
        uploadConfig.homeDirectory,
        user.avatar,
      );
      const userAvatarFile = await fs.promises.stat(userAvatarFilePath);

      if (userAvatarFile) {
        await fs.promises.unlink(userAvatarFilePath);
      }
    }

    user.avatar = avatarFileName;
    userRepository.save(user);
    delete user.password;

    return user;
  }
}

export default UpdateUserAvatarService;
