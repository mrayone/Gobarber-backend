import { getRepository } from 'typeorm';
import { compare } from 'bcryptjs';
import { sign } from 'jsonwebtoken';
import AppError from '@shared/errors/AppError';
import User from '@modules/users/infra/typeorm/entities/User';
import authConfig from '@config/Auth';

interface Request {
  email: string;
  password: string;
}

interface Response {
  user: User;
  token: string;
}

class AuthenticateUserService {
  public async execute({ email, password }: Request): Promise<Response> {
    const userRepository = getRepository(User);
    const userExists = await userRepository.findOne({
      where: { email },
    });

    if (!userExists) {
      throw new AppError('Incorrect email or password combination.', 401);
    }
    const passwordMatch = await compare(password, userExists.password);
    if (!passwordMatch) {
      throw new AppError('Incorrect email or password combination.', 401);
    }

    delete userExists.password;
    const { secret, expiresIn } = authConfig.jwt;
    const token = sign({}, secret, {
      subject: userExists.id,
      expiresIn,
    });

    return { user: userExists, token };
  }
}

export default AuthenticateUserService;
