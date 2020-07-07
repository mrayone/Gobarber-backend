import FakeUsersRepository from '@modules/users/repositories/fakes/FakeUsersRepository';
import ListProvidersService from './ListProvidersService';

let fakeUsersRepository: FakeUsersRepository;
let listProvidersService: ListProvidersService;

describe('UpdateProfileService', () => {
  beforeEach(() => {
    fakeUsersRepository = new FakeUsersRepository();
    listProvidersService = new ListProvidersService(fakeUsersRepository);
  });

  it('Should be able to list providers except id', async () => {
    const user1 = await fakeUsersRepository.save({
      name: 'John Un',
      email: 'john.un@example.com',
      password: '123456',
    });

    const user2 = await fakeUsersRepository.save({
      name: 'John Doe',
      email: 'john.doe@example.com',
      password: '123456',
    });

    const user3 = await fakeUsersRepository.save({
      name: 'John Trê',
      email: 'john.tre@example.com',
      password: '123456',
    });

    const users = await listProvidersService.execute(user3?.id);

    expect(users).toEqual([user1, user2]);
  });

  it('Should be able to all providers', async () => {
    const user1 = await fakeUsersRepository.save({
      name: 'John Un',
      email: 'john.un@example.com',
      password: '123456',
    });

    const user2 = await fakeUsersRepository.save({
      name: 'John Doe',
      email: 'john.doe@example.com',
      password: '123456',
    });

    const user3 = await fakeUsersRepository.save({
      name: 'John Trê',
      email: 'john.tre@example.com',
      password: '123456',
    });

    const users = await listProvidersService.execute();

    expect(users).toEqual([user1, user2, user3]);
  });
});
