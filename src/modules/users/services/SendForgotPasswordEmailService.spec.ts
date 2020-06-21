import AppError from '@shared/errors/AppError';
import FakeMailProvider from '@shared/container/providers/MailProvider/Fakes/FakeMailProvider';
import SendForgotPasswordEmailService from './SendForgotPasswordEmailService';
import FakeUsersRepository from '../repositories/fakes/FakeUsersRepository';
import FakeUsersTokensRepository from '../repositories/fakes/FakeUsersTokensRepository';

let fakeUsersRepository: FakeUsersRepository;
let fakeUsersTokensRepository: FakeUsersTokensRepository;
let fakeMailProvider: FakeMailProvider;
let sendForgotPasswordService: SendForgotPasswordEmailService;

describe('SendForgotPasswordEmail', () => {
  beforeEach(() => {
    fakeUsersRepository = new FakeUsersRepository();
    fakeUsersTokensRepository = new FakeUsersTokensRepository();
    fakeMailProvider = new FakeMailProvider();
    sendForgotPasswordService = new SendForgotPasswordEmailService(
      fakeUsersRepository,
      fakeMailProvider,
      fakeUsersTokensRepository,
    );
  });

  it('Should be able to recover the password using the email', async () => {
    const sendMail = jest.spyOn(fakeMailProvider, 'sendMail');

    await fakeUsersRepository.save({
      name: 'John Doe',
      email: 'john.doe@gmail.com',
      password: '123456',
    });

    await sendForgotPasswordService.execute({
      email: 'john.doe@gmail.com',
    });

    expect(sendMail).toHaveBeenCalled();
  });

  it('Should be not able send recover email from a inexisting email', async () => {
    // Act & Assertion

    await expect(
      sendForgotPasswordService.execute({
        email: 'john_doe@gmail.com',
      }),
    ).rejects.toBeInstanceOf(AppError);
  });

  it('Should be generate recovery token for the user id request.', async () => {
    // arrange
    const genereteUserToken = jest.spyOn(fakeUsersTokensRepository, 'generate');

    // act
    const user = await fakeUsersRepository.save({
      name: 'John Doe',
      email: 'john.doe@gmail.com',
      password: '123456',
    });

    await sendForgotPasswordService.execute({
      email: 'john.doe@gmail.com',
    });

    // assertion
    expect(genereteUserToken).toHaveBeenCalledWith(user?.id);
  });
});
