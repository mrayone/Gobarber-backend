import AppError from '@shared/errors/AppError';
import ResetPasswordService from './ResetPasswordService';
import FakeUsersRepository from '../repositories/fakes/FakeUsersRepository';
import FakeUsersTokensRepository from '../repositories/fakes/FakeUsersTokensRepository';
import FakeHashProvider from '../providers/HashProvider/fakes/FakeHashProvider';

let fakeUsersRepository: FakeUsersRepository;
let fakeUsersTokensRepository: FakeUsersTokensRepository;
let resetPasswordService: ResetPasswordService;
let fakeHashProvider: FakeHashProvider;

describe('ResetPasswordService', () => {
  beforeEach(() => {
    fakeUsersRepository = new FakeUsersRepository();
    fakeUsersTokensRepository = new FakeUsersTokensRepository();
    fakeHashProvider = new FakeHashProvider();
    resetPasswordService = new ResetPasswordService(
      fakeUsersRepository,
      fakeUsersTokensRepository,
      fakeHashProvider,
    );
  });

  it('Should be able to reset the password', async () => {
    const user = await fakeUsersRepository.save({
      name: 'John Doe',
      email: 'john.doe@gmail.com',
      password: '123456',
    });

    const generate = jest.spyOn(fakeHashProvider, 'generateHash');

    const newPassword = '1234567';
    const hashPassword = await fakeHashProvider.generateHash(newPassword);
    const { token } = await fakeUsersTokensRepository.generate(user?.id || '');

    await resetPasswordService.execute({
      token,
      password: newPassword,
    });

    const updatedUser = await fakeUsersRepository.findById(user?.id || '');
    expect(generate).toBeCalledWith(newPassword);
    expect(updatedUser?.password).toBe(hashPassword);
  });

  it('should not able to reset the password with non-existing token', async () => {
    await expect(
      resetPasswordService.execute({
        token: 'asdadw2232334544',
        password: '1232323',
      }),
    ).rejects.toBeInstanceOf(AppError);
  });

  it('should not able to reset the password with non-existing user', async () => {
    const { token } = await fakeUsersTokensRepository.generate(
      'non-existing-user',
    );

    await expect(
      resetPasswordService.execute({
        token,
        password: '1232323',
      }),
    ).rejects.toBeInstanceOf(AppError);
  });

  it('Should not be able to reset password if passed more than 2 hours', async () => {
    const user = await fakeUsersRepository.save({
      name: 'John Doe',
      email: 'john.doe@gmail.com',
      password: '123456',
    });

    const newPassword = '1234567';
    const { token } = await fakeUsersTokensRepository.generate(user?.id || '');

    jest.spyOn(Date, 'now').mockImplementationOnce(() => {
      const customDate = new Date();
      return customDate.setHours(customDate.getHours() + 3);
    });

    await expect(
      resetPasswordService.execute({
        token,
        password: newPassword,
      }),
    ).rejects.toBeInstanceOf(AppError);
  });
});

// hash
// expiration toklen
// token inexistente
// user token inexistente
