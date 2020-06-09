import { getRepository } from 'typeorm';
import { hash } from 'bcryptjs';
import AppError from '@shared/errors/AppError';

import User from '@modules/users/infra/typeorm/entities/User';

interface Request {
  name: string;
  email: string;
  password: string;
}

class CreateUserService {
  public async execute({ name, email, password }: Request): Promise<User> {
    const userRepository = getRepository(User);
    const checkIfUserExists = await userRepository.findOne({
      where: { email },
    });

    if (checkIfUserExists) {
      throw new AppError('This e-mail address already registered!');
    }
    const hashPassword = await hash(password, 8);
    const user = userRepository.create({
      name,
      email,
      password: hashPassword,
    });

    await userRepository.save(user);

    delete user.password;

    return user;
  }
}

export default CreateUserService;
