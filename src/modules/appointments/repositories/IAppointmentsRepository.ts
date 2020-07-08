import Appointment from '../infra/typeorm/entities/Appointment';
import ICreateAppointmentDTO from '../dtos/ICreateAppointmentDTO';
import IFindAllInMonthProvider from '../dtos/IFindAllInMonthProvider';

export default interface IAppointmentsRepository {
  findByDate(date: Date): Promise<Appointment | undefined>;
  findAllInMonthFromProvider(
    date: IFindAllInMonthProvider,
  ): Promise<Appointment[]>;
  findByProviderId(provider_id: string): Promise<Appointment[] | undefined>;
  save(appointment: ICreateAppointmentDTO): Promise<Appointment | undefined>;
}
