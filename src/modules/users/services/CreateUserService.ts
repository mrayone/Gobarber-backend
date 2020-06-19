import { hash } from 'bcryptjs';
import AppError from '@shared/errors/AppError';
import User from '@modules/users/infra/typeorm/entities/User';
import IUserRepository from '../repositories/IUserRepository';

interface IRequest {
  name: string;
  email: string;
  password: string;
}

class CreateUserService {
  constructor(private userRepository: IUserRepository) {}

  public async execute({
    name,
    email,
    password,
  }: IRequest): Promise<User | undefined> {
    const checkIfUserExists = await this.userRepository.findByEmail(email);

    if (checkIfUserExists) {
      throw new AppError('This e-mail address already registered!');
    }
    const hashPassword = await hash(password, 8);
    const user = await this.userRepository.save({
      name,
      email,
      password: hashPassword,
    });

    delete user?.password;

    return user || undefined;
  }
}

export default CreateUserService;
