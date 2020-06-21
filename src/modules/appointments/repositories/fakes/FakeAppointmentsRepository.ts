import { uuid } from 'uuidv4';
import { isEqual } from 'date-fns';
import IAppointmentsRepository from '@modules/appointments/repositories/IAppointmentsRepository';
import ICreateAppointmentDTO from '@modules/appointments/dtos/ICreateAppointmentDTO';

import Appointment from '../../infra/typeorm/entities/Appointment';

class AppointmentsRepository implements IAppointmentsRepository {
  private appointments: Appointment[] = [];

  public async save({
    date,
    providerId,
  }: ICreateAppointmentDTO): Promise<Appointment | undefined> {
    const appointment = new Appointment();

    Object.assign(appointment, { id: uuid(), date, providerId });

    this.appointments.push(appointment);

    return appointment || undefined;
  }

  public async findByProviderId(
    provider_id: string,
  ): Promise<Appointment[] | undefined> {
    const appointments = this.appointments.filter(
      appointment => appointment.providerId === provider_id,
    );

    return appointments || undefined;
  }

  public async findByDate(date: Date): Promise<Appointment | undefined> {
    const appointmentFinded = this.appointments.find(appointment =>
      isEqual(appointment.date, date),
    );

    return appointmentFinded || undefined;
  }
}

export default AppointmentsRepository;
