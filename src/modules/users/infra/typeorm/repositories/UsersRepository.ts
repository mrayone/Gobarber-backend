import { Repository, getRepository, Not } from 'typeorm';
import IUsersRepository from '@modules/users/repositories/IUsersRepository';
import ICreateUserDTO from '@modules/users/dtos/ICreateUserDTO';
import IListProvidersDTO from '@modules/users/dtos/IListProvidersDTO';
import User from '../entities/User';

export default class UsersRepository implements IUsersRepository {
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

  public async findAllProviders({
    except_provider_id,
  }: IListProvidersDTO): Promise<User[]> {
    return except_provider_id
      ? this.ormRepository.find({
          where: { id: Not(except_provider_id) },
        })
      : this.ormRepository.find();
  }

  public async save(user: ICreateUserDTO): Promise<User> {
    const newUser = this.ormRepository.create(user);

    await this.ormRepository.save(newUser);

    return newUser;
  }
}
