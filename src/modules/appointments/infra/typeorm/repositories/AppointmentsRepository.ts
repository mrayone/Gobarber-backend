import { getRepository, Repository, Raw } from 'typeorm';
import IAppointmentsRepository from '@modules/appointments/repositories/IAppointmentsRepository';
import ICreateAppointmentDTO from '@modules/appointments/dtos/ICreateAppointmentDTO';

import IFindAllInMonthProvider from '@modules/appointments/dtos/IFindAllInMonthProvider';
import Appointment from '../entities/Appointment';

class AppointmentsRepository implements IAppointmentsRepository {
  private ormRepository: Repository<Appointment>;

  constructor() {
    this.ormRepository = getRepository(Appointment);
  }

  public async save({
    date,
    providerId,
  }: ICreateAppointmentDTO): Promise<Appointment | undefined> {
    const appointment = this.ormRepository.create({
      date,
      providerId,
    });

    await this.ormRepository.save(appointment);

    return appointment || undefined;
  }

  public async findByProviderId(
    provider_id: string,
  ): Promise<Appointment[] | undefined> {
    const appointments = await this.ormRepository.find({
      where: { providerId: provider_id },
    });

    return appointments || undefined;
  }

  public async findByDate(date: Date): Promise<Appointment | undefined> {
    const findAppointment = await this.ormRepository.findOne({
      where: { date },
    });

    return findAppointment || undefined;
  }

  public async findAllInMonthFromProvider({
    provider_id,
    year,
    month,
  }: IFindAllInMonthProvider): Promise<Appointment[]> {
    const parseMonth = String(month).padStart(2, '0');

    const appointments = await this.ormRepository.find({
      where: {
        providerId: provider_id,
        date: Raw(
          dateFieldName =>
            `to_char(${dateFieldName}, 'MM-YYYY') = ${parseMonth}-${year}`,
        ),
      },
    });

    return appointments;
  }
}

export default AppointmentsRepository;
