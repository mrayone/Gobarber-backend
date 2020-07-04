import AppError from '@shared/errors/AppError';
import CreateUserService from './CreateUserService';
import FakeUsersRepository from '../repositories/fakes/FakeUsersRepository';
import FakeHashProvider from '../providers/HashProvider/fakes/FakeHashProvider';

let fakeUsersRepository: FakeUsersRepository;
let fakeHashProvider: FakeHashProvider;
let createUsersService: CreateUserService;

describe('CreateUserService', () => {
  beforeEach(() => {
    fakeUsersRepository = new FakeUsersRepository();
    fakeHashProvider = new FakeHashProvider();
    createUsersService = new CreateUserService(
      fakeUsersRepository,
      fakeHashProvider,
    );
  });

  it('Should be able to create a new user', async () => {
    const user = await createUsersService.execute({
      email: 'john.doe@gmail.com',
      name: 'John Doe',
      password: '124578',
    });

    expect(user).toHaveProperty('id');
    expect(user?.email).toBe('john.doe@gmail.com');
  });

  it('Should not be able to create a new user with email address already exists', async () => {
    await createUsersService.execute({
      email: 'john.doe@gmail.com',
      name: 'John Doe',
      password: '124578',
    });

    await expect(
      createUsersService.execute({
        email: 'john.doe@gmail.com',
        name: 'John Doe',
        password: '124578',
      }),
    ).rejects.toBeInstanceOf(AppError);
  });
});
