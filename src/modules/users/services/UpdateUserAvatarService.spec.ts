import FakeStorageProvider from '@shared/container/providers/StorageProvider/Fakes/FakeStorageProvider';
import AppError from '@shared/errors/AppError';
import FakeUsersRepository from '../repositories/fakes/FakeUsersRepository';
import UpdateUserAvatarService from './UpdateUserAvatarService';

let fakeUsersRepository: FakeUsersRepository;
let fakeStorageProvider: FakeStorageProvider;
let updateUserAvatarService: UpdateUserAvatarService;

describe('UpdateUserAvatarService', () => {
  beforeEach(() => {
    fakeUsersRepository = new FakeUsersRepository();
    fakeStorageProvider = new FakeStorageProvider();
    updateUserAvatarService = new UpdateUserAvatarService(
      fakeUsersRepository,
      fakeStorageProvider,
    );
  });

  it('Should be able to upload user avatar', async () => {
    const user = await fakeUsersRepository.save({
      name: 'John Doe',
      email: 'john.doe@example.com',
      password: '123456',
    });

    await updateUserAvatarService.execute({
      user_id: user?.id ?? '',
      avatarFileName: 'avatar.jpg',
    });

    expect(user?.avatar).toBe('avatar.jpg');
  });

  it('Should not be able to upload user avatar when not exists user', async () => {
    await expect(
      updateUserAvatarService.execute({
        user_id: '121323323',
        avatarFileName: 'avatar.jpg',
      }),
    ).rejects.toBeInstanceOf(AppError);
  });

  it('Should be able to upload a new user avatar end delete old', async () => {
    const deleteFile = jest.spyOn(fakeStorageProvider, 'deleteFile');
    const user = await fakeUsersRepository.save({
      name: 'John Doe',
      email: 'john.doe@example.com',
      password: '123456',
    });

    await updateUserAvatarService.execute({
      user_id: user?.id ?? '',
      avatarFileName: 'avatar.jpg',
    });

    await updateUserAvatarService.execute({
      user_id: user?.id ?? '',
      avatarFileName: 'avatarAh.jpg',
    });

    expect(deleteFile).toHaveBeenCalledWith('avatar.jpg');
    expect(user?.avatar).toBe('avatarAh.jpg');
  });
});
