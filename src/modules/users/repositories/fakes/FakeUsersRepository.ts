import IUsersRepository from '@modules/users/repositories/IUsersRepository';
import ICreateUserDTO from '@modules/users/dtos/ICreateUserDTO';
import { uuid } from 'uuidv4';
import User from '../../infra/typeorm/entities/User';

export default class FakeUsersRepository implements IUsersRepository {
  private users: User[] = [];

  public async findById(id: string): Promise<User | undefined> {
    const userFinded = await this.users.find(user => user.id === id);

    return userFinded || undefined;
  }

  public async findByEmail(email: string): Promise<User | undefined> {
    const userFinded = await this.users.find(user => user.email === email);

    return userFinded || undefined;
  }

  public async save(userData: ICreateUserDTO): Promise<User | undefined> {
    const user = new User();
    const newUser = Object.assign(user, { id: uuid(), ...userData });

    this.users.push(newUser);

    return newUser;
  }
}
