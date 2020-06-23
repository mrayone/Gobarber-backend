import { injectable, inject } from 'tsyringe';
import { differenceInHours } from 'date-fns';
import AppError from '@shared/errors/AppError';
import IUsersRepository from '../repositories/IUsersRepository';
import IUsersTokensRepository from '../repositories/IUsersTokensRepository';
import IHashProvider from '../providers/HashProvider/models/IHashProvider';

interface IRequest {
  token: string;
  password: string;
}

@injectable()
class ResetPasswordService {
  constructor(
    @inject('UsersRepository')
    private usersRepository: IUsersRepository,

    @inject('UsersTokenRepository')
    private usersTokensRepository: IUsersTokensRepository,

    @inject('HashProvider')
    private hashProvider: IHashProvider,
  ) {}

  public async execute({ token, password }: IRequest): Promise<void> {
    const userToken = await this.usersTokensRepository.findByToken(token);

    if (!userToken) throw new AppError('This token not exists!');

    const user = await this.usersRepository.findById(userToken.user_id);

    if (!user) throw new AppError('This user not exists!');

    const tokenCreatedAt = userToken.createdAt;
    if (differenceInHours(Date.now(), tokenCreatedAt) > 2)
      throw new AppError('Token expired');

    const hashPassword = await this.hashProvider.generateHash(password);
    user.password = hashPassword;

    await this.usersRepository.save(user);
  }
}

export default ResetPasswordService;
