import Appointment from '../infra/typeorm/entities/Appointment';
import ICreateAppointmentDTO from '../dtos/ICreateAppointmentDTO';
import IFindAllInMonthProvider from '../dtos/IFindAllInMonthProvider';
import IFindAllInDayProvider from '../dtos/IFindAllInDayProvider';

export default interface IAppointmentsRepository {
  findByDate(date: Date): Promise<Appointment | undefined>;
  findAllInMonthFromProvider(
    date: IFindAllInMonthProvider,
  ): Promise<Appointment[]>;
  findAllInDayFromProvider(date: IFindAllInDayProvider): Promise<Appointment[]>;
  findByProviderId(provider_id: string): Promise<Appointment[] | undefined>;
  save(appointment: ICreateAppointmentDTO): Promise<Appointment | undefined>;
}
