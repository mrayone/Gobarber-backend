import { injectable, inject } from 'tsyringe';
import AppError from '@shared/errors/AppError';
import User from '@modules/users/infra/typeorm/entities/User';
import IHashProvider from '../providers/HashProvider/models/IHashProvider';
import IUsersRepository from '../repositories/IUsersRepository';

interface IRequest {
  user_id: string;
  name: string;
  email: string;
  password?: string;
  old_password?: string;
}

@injectable()
class UpdateProfileService {
  constructor(
    @inject('UsersRepository') private userRepository: IUsersRepository,
    @inject('HashProvider') private hashProvider: IHashProvider,
  ) {}

  public async execute({
    user_id,
    name,
    email,
    password,
    old_password,
  }: IRequest): Promise<User | undefined> {
    const user = await this.userRepository.findById(user_id);

    if (!user) {
      throw new AppError('User not found.');
    }

    const userWithEmailAddress = await this.userRepository.findByEmail(email);

    if (userWithEmailAddress && userWithEmailAddress.id !== user_id) {
      throw new AppError('This email address are in use.');
    }

    if (password && old_password) {
      const matchOldPassword = await this.hashProvider.compareHash(
        old_password,
        user.password,
      );
      if (!matchOldPassword)
        throw new AppError('The current password provided does not match.');

      user.password = await this.hashProvider.generateHash(password);
    }

    user.name = name;
    user.email = email;

    return this.userRepository.save(user);
  }
}

export default UpdateProfileService;
