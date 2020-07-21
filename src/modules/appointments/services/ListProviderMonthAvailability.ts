import { injectable, inject } from 'tsyringe';
import { getDaysInMonth, getDate, isAfter } from 'date-fns';
import IAppointmentsRepository from '../repositories/IAppointmentsRepository';

interface IRequest {
  provider_id: string;
  month: number;
  year: number;
}

type IResponse = Array<{
  day: number;
  available: boolean;
}>;

@injectable()
class ListProviderMonthAvailability {
  constructor(
    @inject('AppointmentsRepository')
    private appointmentsRepository: IAppointmentsRepository,
  ) {}

  public async execute({
    provider_id,
    month,
    year,
  }: IRequest): Promise<IResponse> {
    const appointments = await this.appointmentsRepository.findAllInMonthFromProvider(
      {
        provider_id,
        month,
        year,
      },
    );

    const numberOfDayInMonth = getDaysInMonth(new Date(year, month - 1));
    const eachDaysArray = Array.from(
      { length: numberOfDayInMonth },
      (_, index) => index + 1,
    );

    const availableDates = eachDaysArray.map(day => {
      const appointmentsInDay = appointments.filter(
        appointment => getDate(appointment.date) === day,
      );

      const compareDate = new Date(year, month - 1, day, 23, 59, 59);
      return {
        day,
        available:
          appointmentsInDay.length < 10 && isAfter(compareDate, new Date()),
      };
    });

    return availableDates;
  }
}

export default ListProviderMonthAvailability;
