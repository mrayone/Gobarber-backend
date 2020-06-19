import Appointment from '../infra/typeorm/entities/Appointment';
import ICreateAppointmentDTO from '../dtos/ICreateAppointmentDTO';

export default interface IAppointmentRepository {
  findByDate(date: Date): Promise<Appointment | undefined>;
  save(appointment: ICreateAppointmentDTO): Promise<Appointment | undefined>;
}
