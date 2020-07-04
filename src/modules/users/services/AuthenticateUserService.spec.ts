import AppError from '@shared/errors/AppError';
import CreateUserService from './CreateUserService';
import AuthenticateUserService from './AuthenticateUserService';
import FakeUsersRepository from '../repositories/fakes/FakeUsersRepository';
import FakeHashProvider from '../providers/HashProvider/fakes/FakeHashProvider';

let fakeUsersRepository: FakeUsersRepository;
let fakeHashProvider: FakeHashProvider;
let createUsersService: CreateUserService;
let authenticateUserService: AuthenticateUserService;

describe('AuthenticateUserService', () => {
  beforeEach(() => {
    fakeUsersRepository = new FakeUsersRepository();
    fakeHashProvider = new FakeHashProvider();
    createUsersService = new CreateUserService(
      fakeUsersRepository,
      fakeHashProvider,
    );
    authenticateUserService = new AuthenticateUserService(
      fakeUsersRepository,
      fakeHashProvider,
    );
  });
  it('Should be able to authenticate user', async () => {
    await createUsersService.execute({
      email: 'john.doe@gmail.com',
      name: 'John Doe',
      password: '124578',
    });

    const response = await authenticateUserService.execute({
      email: 'john.doe@gmail.com',
      password: '124578',
    });

    expect(response).toHaveProperty('token');
  });

  it('Should not be able autenthicate with non existing user', async () => {
    await expect(
      authenticateUserService.execute({
        email: 'john.doe@gmail.com',
        password: '124578',
      }),
    ).rejects.toBeInstanceOf(AppError);
  });

  it('Should not be able autenthicate when email and password not match', async () => {
    await createUsersService.execute({
      email: 'john.doe@gmail.com',
      name: 'John Doe',
      password: '124578',
    });

    await expect(
      authenticateUserService.execute({
        email: 'john.doe@gmail.com',
        password: '1245788',
      }),
    ).rejects.toBeInstanceOf(AppError);
  });
});
