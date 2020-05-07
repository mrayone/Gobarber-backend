import { getRepository } from 'typeorm';
import { hash } from 'bcryptjs';
import User from '../models/User';

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
      throw new Error('This e-mail address already registered!');
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
