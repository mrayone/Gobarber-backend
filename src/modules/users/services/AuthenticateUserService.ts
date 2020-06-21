import { sign } from 'jsonwebtoken';
import { injectable, inject } from 'tsyringe';
import AppError from '@shared/errors/AppError';
import User from '@modules/users/infra/typeorm/entities/User';
import authConfig from '@shared/config/Auth';
import IUsersRepository from '../repositories/IUsersRepository';
import IHashProvider from '../providers/HashProvider/models/IHashProvider';

interface IRequest {
  email: string;
  password: string;
}

interface IResponse {
  user: User;
  token: string;
}
@injectable()
class AuthenticateUserService {
  constructor(
    @inject('UsersRepository') private userRepository: IUsersRepository,
    @inject('HashProvider') private hashProvider: IHashProvider,
  ) {}

  public async execute({ email, password }: IRequest): Promise<IResponse> {
    const userExists = await this.userRepository.findByEmail(email);

    if (!userExists) {
      throw new AppError('Incorrect email or password combination.', 401);
    }
    const passwordMatch = await this.hashProvider.compareHash(
      password,
      userExists.password,
    );
    if (!passwordMatch) {
      throw new AppError('Incorrect email or password combination.', 401);
    }

    const { secret, expiresIn } = authConfig.jwt;
    const token = sign({}, secret, {
      subject: userExists.id,
      expiresIn,
    });

    return { user: userExists, token };
  }
}

export default AuthenticateUserService;
