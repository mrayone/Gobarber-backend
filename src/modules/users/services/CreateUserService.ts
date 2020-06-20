import { hash } from 'bcryptjs';
import { injectable, inject } from 'tsyringe';
import AppError from '@shared/errors/AppError';
import User from '@modules/users/infra/typeorm/entities/User';
import IUsersRepository from '../repositories/IUsersRepository';

interface IRequest {
  name: string;
  email: string;
  password: string;
}

@injectable()
class CreateUserService {
  constructor(
    @inject('UsersRepository') private usersRepository: IUsersRepository,
  ) {}

  public async execute({
    name,
    email,
    password,
  }: IRequest): Promise<User | undefined> {
    const checkIfUserExists = await this.usersRepository.findByEmail(email);

    if (checkIfUserExists) {
      throw new AppError('This e-mail address already registered!');
    }
    const hashPassword = await hash(password, 8);
    const user = await this.usersRepository.save({
      name,
      email,
      password: hashPassword,
    });

    delete user?.password;

    return user || undefined;
  }
}

export default CreateUserService;
