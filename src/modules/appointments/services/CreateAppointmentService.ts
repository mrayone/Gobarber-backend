import { startOfHour } from 'date-fns';
import AppError from '@shared/errors/AppError';

import Appoitment from '@modules/appointments/infra/typeorm/entities/Appointment';
import IAppointmentRepository from '../repositories/IAppointmentRepository';

interface IRequest {
  providerId: string;
  date: Date;
}

class CreateAppointmentService {
  constructor(private appointmentRepository: IAppointmentRepository) {}

  public async execute({
    providerId,
    date,
  }: IRequest): Promise<Appoitment | undefined> {
    const appointmentDate = startOfHour(date);

    const findAppointmentInSameDate = await this.appointmentRepository.findByDate(
      appointmentDate,
    );

    if (findAppointmentInSameDate) {
      throw new AppError('This appointment is already booked');
    }

    const appointment = await this.appointmentRepository.save({
      date: appointmentDate,
      providerId,
    });

    return appointment;
  }
}

export default CreateAppointmentService;
