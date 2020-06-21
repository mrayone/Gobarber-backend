import IHashProvider from '../models/IHashProvider';

export default class FakeHashProvider implements IHashProvider {
  public async generateHash(payload: string): Promise<string> {
    return payload;
  }

  public async compareHash(
    payload: string,
    compareHash: string,
  ): Promise<boolean> {
    return payload === compareHash;
  }
}
