import AppError from '@shared/errors/AppError';
import CreateUserService from './CreateUserService';
import FakeUsersRepository from '../repositories/fakes/FakeUsersRepository';
import FakeHashProvider from '../providers/HashProvider/fakes/FakeHashProvider';

describe('CreateUserService', () => {
  it('Should be able to create a new user', async () => {
    const fakeUsersRepository = new FakeUsersRepository();
    const fakeHashProvider = new FakeHashProvider();
    const createUsersService = new CreateUserService(
      fakeUsersRepository,
      fakeHashProvider,
    );
    const user = await createUsersService.execute({
      email: 'john.doe@gmail.com',
      name: 'John Doe',
      password: '124578',
    });

    expect(user).toHaveProperty('id');
    expect(user?.email).toBe('john.doe@gmail.com');
  });

  it('Should not be able to create a new user with email address already exists', async () => {
    const fakeUsersRepository = new FakeUsersRepository();
    const fakeHashProvider = new FakeHashProvider();
    const createUsersService = new CreateUserService(
      fakeUsersRepository,
      fakeHashProvider,
    );
    await createUsersService.execute({
      email: 'john.doe@gmail.com',
      name: 'John Doe',
      password: '124578',
    });

    expect(
      createUsersService.execute({
        email: 'john.doe@gmail.com',
        name: 'John Doe',
        password: '124578',
      }),
    ).rejects.toBeInstanceOf(AppError);
  });
});
