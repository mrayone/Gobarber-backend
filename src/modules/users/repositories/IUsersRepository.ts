import User from '../infra/typeorm/entities/User';
import ICreateUserDTO from '../dtos/ICreateUserDTO';
import IListProvidersDTO from '../dtos/IListProvidersDTO';

export default interface IUsersRepository {
  findAllProviders(date: IListProvidersDTO): Promise<User[]>;
  findById(id: string): Promise<User | undefined>;
  findByEmail(email: string): Promise<User | undefined>;
  save(user: ICreateUserDTO): Promise<User | undefined>;
}
