import { uuid } from 'uuidv4';
import UserToken from '../../infra/typeorm/entities/UserToken';
import IUsersTokensRepository from '../IUsersTokensRepository';

export default class FakeUsersTokensRepository
  implements IUsersTokensRepository {
  private usersTokens: UserToken[] = [];

  public async generate(user_id: string): Promise<UserToken> {
    const userToken = new UserToken();
    Object.assign(userToken, {
      id: uuid(),
      user_id,
      token: uuid(),
    });

    this.usersTokens.push(userToken);

    return userToken;
  }
}
