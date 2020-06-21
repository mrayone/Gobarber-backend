import AppError from '@shared/errors/AppError';
import CreateUserService from './CreateUserService';
import FakeUsersRepository from '../repositories/fakes/FakeUsersRepository';

describe('CreateUserService', () => {
  it('Should be able to create a new user', async () => {
    const fakeUsersRepository = new FakeUsersRepository();
    const createUsersService = new CreateUserService(fakeUsersRepository);

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
    const createUsersService = new CreateUserService(fakeUsersRepository);

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
