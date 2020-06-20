import fs from 'fs';
import path from 'path';
import { injectable, inject } from 'tsyringe';
import AppError from '@shared/errors/AppError';
import uploadConfig from '@shared/config/upload';
import User from '@modules/users/infra/typeorm/entities/User';
import IUsersRepository from '../repositories/IUsersRepository';

interface IRequest {
  user_id: string;
  avatarFileName: string;
}

@injectable()
class UpdateUserAvatarService {
  constructor(
    @inject('UsersRepository') private userRepository: IUsersRepository,
  ) {}

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
