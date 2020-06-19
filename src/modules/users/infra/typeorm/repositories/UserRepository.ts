import { Repository, getRepository } from 'typeorm';
import IUserRepository from '@modules/users/repositories/IUserRepository';
import ICreateUserDTO from '@modules/users/dtos/ICreateUserDTO';
import User from '../entities/User';

export default class UserRepository implements IUserRepository {
  private ormRepository: Repository<User>;

  constructor() {
    this.ormRepository = getRepository(User);
  }

  public async findById(id: string): Promise<User | undefined> {
    const user = await this.ormRepository.findOne(id);

    return user || undefined;
  }

  public async findByEmail(email: string): Promise<User | undefined> {
    const user = await this.ormRepository.findOne({
      where: { email },
    });

    return user || undefined;
  }

  public async save(user: ICreateUserDTO): Promise<User | undefined> {
    const newUser = this.ormRepository.create(user);

    await this.ormRepository.save(newUser);

    return newUser || undefined;
  }
}
