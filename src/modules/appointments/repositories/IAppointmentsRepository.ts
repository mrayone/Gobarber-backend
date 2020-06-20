import Appointment from '../infra/typeorm/entities/Appointment';
import ICreateAppointmentDTO from '../dtos/ICreateAppointmentDTO';

export default interface IAppointmentsRepository {
  findByDate(date: Date): Promise<Appointment | undefined>;
  findByProviderId(provider_id: string): Promise<Appointment[] | undefined>;
  save(appointment: ICreateAppointmentDTO): Promise<Appointment | undefined>;
}
