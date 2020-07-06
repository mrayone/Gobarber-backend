import { injectable, inject } from 'tsyringe';
import AppError from '@shared/errors/AppError';
import User from '@modules/users/infra/typeorm/entities/User';
import IUsersRepository from '../repositories/IUsersRepository';

@injectable()
class ShowProfileService {
  constructor(
    @inject('UsersRepository') private userRepository: IUsersRepository,
  ) {}

  public async execute(user_id: string): Promise<User | undefined> {
    const user = await this.userRepository.findById(user_id);
    if (!user) throw new AppError(`Not authorized`, 401);

    return user;
  }
}

export default ShowProfileService;
