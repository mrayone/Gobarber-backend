import IUsersRepository from '@modules/users/repositories/IUsersRepository';
import ICreateUserDTO from '@modules/users/dtos/ICreateUserDTO';
import { uuid } from 'uuidv4';
import IListProvidersDTO from '@modules/users/dtos/IListProvidersDTO';
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

  public async findAllProviders({
    except_provider_id,
  }: IListProvidersDTO): Promise<User[]> {
    return except_provider_id
      ? this.users.filter(user => user.id !== except_provider_id)
      : this.users;
  }

  public async save({
    name,
    email,
    password,
    id,
  }: ICreateUserDTO): Promise<User | undefined> {
    if (id) {
      const updatedUser = this.users.find(user => user.id === id);

      Object.assign(updatedUser, { name, email, password });
      return updatedUser;
    }

    const newUser = Object.assign(new User(), {
      id: uuid(),
      name,
      email,
      password,
    });

    this.users.push(newUser);

    return newUser;
  }
}
