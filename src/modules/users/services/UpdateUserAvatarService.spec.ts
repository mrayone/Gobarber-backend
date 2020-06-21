import FakeStorageProvider from '@shared/container/providers/StorageProvider/Fakes/FakeStorageProvider';
import AppError from '@shared/errors/AppError';
import FakeUsersRepository from '../repositories/fakes/FakeUsersRepository';
import UpdateUserAvatarService from './UpdateUserAvatarService';

describe('UpdateUserAvatarService', () => {
  it('Should be able to upload user avatar', async () => {
    const fakeUsersRepository = new FakeUsersRepository();
    const fakeStorageProvider = new FakeStorageProvider();
    const updateUserAvatarService = new UpdateUserAvatarService(
      fakeUsersRepository,
      fakeStorageProvider,
    );

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
    const fakeUsersRepository = new FakeUsersRepository();
    const fakeStorageProvider = new FakeStorageProvider();
    const updateUserAvatarService = new UpdateUserAvatarService(
      fakeUsersRepository,
      fakeStorageProvider,
    );

    expect(
      updateUserAvatarService.execute({
        user_id: '121323323',
        avatarFileName: 'avatar.jpg',
      }),
    ).rejects.toBeInstanceOf(AppError);
  });

  it('Should be able to upload a new user avatar end delete old', async () => {
    const fakeUsersRepository = new FakeUsersRepository();
    const fakeStorageProvider = new FakeStorageProvider();

    const deleteFile = jest.spyOn(fakeStorageProvider, 'deleteFile');

    const updateUserAvatarService = new UpdateUserAvatarService(
      fakeUsersRepository,
      fakeStorageProvider,
    );

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
