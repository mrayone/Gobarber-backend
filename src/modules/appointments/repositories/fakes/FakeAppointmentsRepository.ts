import { uuid } from 'uuidv4';
import { isEqual, getMonth, getDate, getYear } from 'date-fns';
import IAppointmentsRepository from '@modules/appointments/repositories/IAppointmentsRepository';
import ICreateAppointmentDTO from '@modules/appointments/dtos/ICreateAppointmentDTO';

import IFindAllInMonthProvider from '@modules/appointments/dtos/IFindAllInMonthProvider';
import IFindAllInDayProvider from '@modules/appointments/dtos/IFindAllInDayProvider';
import Appointment from '../../infra/typeorm/entities/Appointment';

class FakeAppointmentsRepository implements IAppointmentsRepository {
  private appointments: Appointment[] = [];

  public async save({
    date,
    userId,
    providerId,
  }: ICreateAppointmentDTO): Promise<Appointment> {
    const appointment = new Appointment();

    Object.assign(appointment, { id: uuid(), date, providerId, userId });

    this.appointments.push(appointment);

    return appointment;
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

  public async findAllInMonthFromProvider({
    provider_id,
    year,
    month,
  }: IFindAllInMonthProvider): Promise<Appointment[]> {
    const appointments = this.appointments.filter(
      appointment =>
        appointment.providerId === provider_id &&
        getMonth(appointment.date) + 1 === month &&
        getYear(appointment.date) === year,
    );

    return appointments;
  }

  public async findAllInDayFromProvider({
    provider_id,
    day,
    year,
    month,
  }: IFindAllInDayProvider): Promise<Appointment[]> {
    const appointments = this.appointments.filter(
      appointment =>
        appointment.providerId === provider_id &&
        getDate(appointment.date) === day &&
        getMonth(appointment.date) + 1 === month &&
        getYear(appointment.date) === year,
    );

    return appointments;
  }
}

export default FakeAppointmentsRepository;
