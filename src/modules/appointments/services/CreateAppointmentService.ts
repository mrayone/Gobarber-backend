import { startOfHour, isBefore, getHours, format } from 'date-fns';
import AppError from '@shared/errors/AppError';
import { injectable, inject } from 'tsyringe';

import Appoitment from '@modules/appointments/infra/typeorm/entities/Appointment';
import INotificationsRepository from '@modules/notifications/repositories/INotificationsRepository';
import IAppointmentsRepository from '../repositories/IAppointmentsRepository';

interface IRequest {
  providerId: string;
  userId: string;
  date: Date;
}

interface IValidate {
  appointmentDate: Date;
  providerId: string;
  userId: string;
}

@injectable()
class CreateAppointmentService {
  constructor(
    @inject('AppointmentsRepository')
    private appointmentsRepository: IAppointmentsRepository,
    @inject('NotificationsRepository')
    private notificationsRepository: INotificationsRepository,
  ) {}

  public async execute({
    providerId,
    userId,
    date,
  }: IRequest): Promise<Appoitment> {
    const appointmentDate = startOfHour(date);

    await this.validate({ appointmentDate, userId, providerId });

    const appointment = await this.appointmentsRepository.save({
      date: appointmentDate,
      userId,
      providerId,
    });

    const formatedDate = format(date, "dd/MM/yyyy 'às' HH:mm'h'");
    await this.notificationsRepository.create({
      content: `Novo agendamento criado ${formatedDate}`,
      recipient_id: appointment.id,
    });

    return appointment;
  }

  private async validate({
    appointmentDate,
    userId,
    providerId,
  }: IValidate): Promise<void> {
    const dateNow = Date.now();
    if (isBefore(appointmentDate, dateNow))
      throw new AppError("You can't create appointment with past date");

    if (getHours(appointmentDate) < 8 || getHours(appointmentDate) > 17)
      throw new AppError(
        "You can't create appointment before 8am or after 5pm",
      );

    const findAppointmentInSameDate = await this.appointmentsRepository.findByDate(
      appointmentDate,
    );

    if (findAppointmentInSameDate) {
      throw new AppError('This appointment is already booked');
    }

    if (userId === providerId)
      throw new AppError("You can't create an appointment with yourself");
  }
}

export default CreateAppointmentService;
