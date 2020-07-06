import AppError from '@shared/errors/AppError';
import FakeUsersRepository from '../repositories/fakes/FakeUsersRepository';
import ShowProfileService from './ShowProfileService';

let fakeUsersRepository: FakeUsersRepository;
let showProfileService: ShowProfileService;

describe('UpdateProfileService', () => {
  beforeEach(() => {
    fakeUsersRepository = new FakeUsersRepository();
    showProfileService = new ShowProfileService(fakeUsersRepository);
  });

  it('Should be able see profile', async () => {
    const user = await fakeUsersRepository.save({
      name: 'John Doe',
      email: 'john.doe@example.com',
      password: '123456',
    });

    const userProfile = await showProfileService.execute(user?.id ?? '');

    expect(userProfile?.name).toBe(user?.name);
    expect(userProfile?.email).toBe(user?.email);
  });

  it('Should be able see profile', async () => {
    await fakeUsersRepository.save({
      name: 'John Doe',
      email: 'john.doe@example.com',
      password: '123456',
    });

    await expect(
      showProfileService.execute('not-provided-id'),
    ).rejects.toBeInstanceOf(AppError);
  });
});
