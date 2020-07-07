import { injectable, inject } from 'tsyringe';
import User from '@modules/users/infra/typeorm/entities/User';
import IUsersRepository from '@modules/users/repositories/IUsersRepository';

@injectable()
class ListprovidersService {
  constructor(
    @inject('UsersRepository') private userRepository: IUsersRepository,
  ) {}

  public async execute(user_id?: string): Promise<User[]> {
    const users = await this.userRepository.findAllProviders({
      except_provider_id: user_id,
    });

    return users;
  }
}

export default ListprovidersService;
