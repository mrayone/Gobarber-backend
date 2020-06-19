import fs from 'fs';
import path from 'path';
import AppError from '@shared/errors/AppError';
import uploadConfig from '@shared/config/upload';
import User from '@modules/users/infra/typeorm/entities/User';
import IUserRepository from '../repositories/IUserRepository';

interface IRequest {
  user_id: string;
  avatarFileName: string;
}

class UpdateUserAvatarService {
  constructor(private userRepository: IUserRepository) {}

  public async execute({ user_id, avatarFileName }: IRequest): Promise<User> {
    const user = await this.userRepository.findById(user_id);

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
    await this.userRepository.save(user);
    delete user.password;

    return user;
  }
}

export default UpdateUserAvatarService;
