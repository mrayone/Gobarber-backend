import nodemailer, { Transporter } from 'nodemailer';
import aws from 'aws-sdk';
import mailConfig from '@shared/config/mail';
import { inject, injectable } from 'tsyringe';
import ISendMailDTO from '../dtos/ISendMailDTO';
import IMailProvider from '../models/IMailProvider';
import IMailTemplateProvider from '../../MailTemplateProvider/models/IMailTemplateProvider';

@injectable()
class SESMailProvider implements IMailProvider {
  client: Transporter;

  constructor(
    @inject('MailTemplateProvider')
    private mailTemplateProvider: IMailTemplateProvider,
  ) {
    this.client = nodemailer.createTransport({
      SES: new aws.SES({
        apiVersion: '2010-12-01',
      }),
    });
  }

  public async sendMail({
    to,
    subject,
    from,
    template,
  }: ISendMailDTO): Promise<void> {
    const {
      defaults: {
        from: { name, address },
      },
    } = mailConfig;
    await this.client.sendMail({
      from: {
        name: from?.name || name,
        address: from?.email || address,
      },
      to: {
        name: to.name,
        address: to.email,
      },
      subject,
      text: await this.mailTemplateProvider.parse(template),
    });
  }
}

export default SESMailProvider;
