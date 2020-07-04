import { injectable, inject } from 'tsyringe';
import AppError from '@shared/errors/AppError';
import IMailProvider from '@shared/container/providers/MailProvider/models/IMailProvider';
import IUsersRepository from '../repositories/IUsersRepository';
import IUsersTokensRepository from '../repositories/IUsersTokensRepository';

interface IRequest {
  email: string;
}

@injectable()
class SendForgotPasswordEmailService {
  constructor(
    @inject('UsersRepository') private usersRepository: IUsersRepository,
    @inject('MailProvider') private mailProvider: IMailProvider,
    @inject('UsersTokensRepository')
    private usersTokensRepository: IUsersTokensRepository,
  ) {}

  public async execute({ email }: IRequest): Promise<void> {
    const findedUser = await this.usersRepository.findByEmail(email);

    if (!findedUser) throw new AppError('The User do not exists');

    const { token } = await this.usersTokensRepository.generate(findedUser.id);

    await this.mailProvider.sendMail({
      to: {
        name: findedUser.name,
        email: findedUser.email,
      },
      subject: '[GoBarber] Recuperação de senha',
      template: {
        template: 'Olá {{name}}: {{token}}',
        variables: {
          token,
          name: findedUser.name,
        },
      },
    });
  }
}

export default SendForgotPasswordEmailService;
