import AppError from '@shared/errors/AppError';
import FakeUsersRepository from '../repositories/fakes/FakeUsersRepository';
import FakeHashProvider from '../providers/HashProvider/fakes/FakeHashProvider';
import UpdateProfileService from './UpdateProfileService';

let fakeUsersRepository: FakeUsersRepository;
let fakeHashProvider: FakeHashProvider;
let updateProfileService: UpdateProfileService;

describe('UpdateProfileService', () => {
  beforeEach(() => {
    fakeUsersRepository = new FakeUsersRepository();
    fakeHashProvider = new FakeHashProvider();
    updateProfileService = new UpdateProfileService(
      fakeUsersRepository,
      fakeHashProvider,
    );
  });

  it('Should be able update use profile', async () => {
    const user = await fakeUsersRepository.save({
      name: 'John Doe',
      email: 'john.doe@example.com',
      password: '123456',
    });

    const userUpdated = await updateProfileService.execute({
      user_id: user?.id ?? '',
      name: 'John Trê',
      email: 'john.tre@example.com',
    });

    expect(userUpdated?.name).toBe('John Trê');
    expect(userUpdated?.email).toBe('john.tre@example.com');
  });

  it('Should be not able update user profile with email address in use', async () => {
    const user = await fakeUsersRepository.save({
      name: 'John Doe',
      email: 'john.doe@example.com',
      password: '123456',
    });

    await fakeUsersRepository.save({
      name: 'John Doe',
      email: 'john.tre@example.com',
      password: '123456',
    });

    await expect(
      updateProfileService.execute({
        user_id: user?.id ?? '',
        name: 'John Trê',
        email: 'john.tre@example.com',
      }),
    ).rejects.toBeInstanceOf(AppError);
  });

  it('Should be update user password', async () => {
    const user = await fakeUsersRepository.save({
      name: 'John Doe',
      email: 'john.doe@example.com',
      password: '123456',
    });

    const userUpdated = await updateProfileService.execute({
      user_id: user?.id ?? '',
      name: 'John Trê',
      email: 'john.tre@example.com',
      old_password: '123456',
      password: '1234567',
    });

    expect(userUpdated?.password).toBe('1234567');
  });

  it('Should not be update user password when old password not match', async () => {
    const user = await fakeUsersRepository.save({
      name: 'John Doe',
      email: 'john.doe@example.com',
      password: '123456',
    });

    await expect(
      updateProfileService.execute({
        user_id: user?.id ?? '',
        name: 'John Trê',
        email: 'john.tre@example.com',
        old_password: 'wrong-old-password',
        password: '1234567',
      }),
    ).rejects.toBeInstanceOf(AppError);
  });
});
