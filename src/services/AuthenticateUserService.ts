import { getRepository } from 'typeorm';
import { compare } from 'bcryptjs';
import { sign } from 'jsonwebtoken';
import User from '../models/User';
import authConfig from '../config/Auth';

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
      throw new Error('Incorrect email or password combination.');
    }
    const passwordMatch = await compare(password, userExists.password);
    if (!passwordMatch) {
      throw new Error('Incorrect email or password combination.');
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
