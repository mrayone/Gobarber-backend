import FakeAppointmentsRepository from '../repositories/fakes/FakeAppointmentsRepository';
import ListProviderDayAvailability from './ListProviderDayAvailability';

let fakeAppointmentsRepository: FakeAppointmentsRepository;
let listProviderMonthAvailability: ListProviderDayAvailability;

describe('ListProviderDayAvailability', () => {
  beforeEach(() => {
    fakeAppointmentsRepository = new FakeAppointmentsRepository();
    listProviderMonthAvailability = new ListProviderDayAvailability(
      fakeAppointmentsRepository,
    );
  });

  it('Should be able to list the day availability from provider', async () => {
    // agendamento das 8 as 17
    await fakeAppointmentsRepository.save({
      providerId: 'user',
      userId: 'user',
      date: new Date(2020, 4, 20, 9, 0, 0),
    });
    const availableHours = [16, 17];
    const promises = Array.from(
      {
        length: 10,
      },
      (_, index) =>
        fakeAppointmentsRepository.save({
          providerId: 'user',
          userId: 'user',
          date: new Date(2020, 4, 22, availableHours[index], 0, 0),
        }),
    );

    await Promise.all(promises);

    jest.spyOn(Date, 'now').mockImplementationOnce(() => {
      return new Date(2020, 4, 22, 11).getTime();
    });

    const appointmentsAvailable = await listProviderMonthAvailability.execute({
      provider_id: 'user',
      day: 22,
      month: 5,
      year: 2020,
    });

    expect(appointmentsAvailable).toEqual(
      expect.arrayContaining([
        {
          hour: 8,
          available: false,
        },
        {
          hour: 9,
          available: false,
        },
        {
          hour: 10,
          available: false,
        },
        {
          hour: 11,
          available: false,
        },
        {
          hour: 12,
          available: true,
        },
        {
          hour: 13,
          available: true,
        },
        {
          hour: 15,
          available: true,
        },
        {
          hour: 16,
          available: false,
        },
        {
          hour: 17,
          available: false,
        },
      ]),
    );
  });
});
