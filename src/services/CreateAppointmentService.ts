import { startOfHour } from 'date-fns';
import { getCustomRepository } from 'typeorm';
import Appoitment from '../models/Appointment';
import AppointmentRepository from '../repositories/AppointmentsRepository';

interface Request {
  providerId: string;
  date: Date;
}

class CreateAppointmentService {
  public async execute({ providerId, date }: Request): Promise<Appoitment> {
    const appointmentRepository = getCustomRepository(AppointmentRepository);

    const appointmentDate = startOfHour(date);

    const findAppointmentInSameDate = await appointmentRepository.findByDate(
      appointmentDate,
    );

    if (findAppointmentInSameDate) {
      throw new Error('This appointment is already booked');
    }

    const appointment = appointmentRepository.create({
      date: appointmentDate,
      providerId,
    });

    await appointmentRepository.save(appointment);
    return appointment;
  }
}

export default CreateAppointmentService;
