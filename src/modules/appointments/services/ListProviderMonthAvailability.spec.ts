import FakeAppointmentsRepository from '../repositories/fakes/FakeAppointmentsRepository';
import ListProviderMonthAvailability from './ListProviderMonthAvailability';

let fakeAppointmentsRepository: FakeAppointmentsRepository;
let listProviderMonthAvailability: ListProviderMonthAvailability;

describe('ListProviderMonthAvailability', () => {
  beforeEach(() => {
    fakeAppointmentsRepository = new FakeAppointmentsRepository();
    listProviderMonthAvailability = new ListProviderMonthAvailability(
      fakeAppointmentsRepository,
    );
  });

  it('Should be able to list the month availability from provider', async () => {
    // agendamento das 8 as 17
    await fakeAppointmentsRepository.save({
      providerId: 'user',
      userId: 'user',
      date: new Date(2020, 4, 20, 9, 0, 0),
    });
    const availableHours = [8, 9, 10, 11, 12, 13, 14, 15, 16, 17];
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

    const appointmentsAvailable = await listProviderMonthAvailability.execute({
      provider_id: 'user',
      month: 5,
      year: 2020,
    });

    expect(appointmentsAvailable).toEqual(
      expect.arrayContaining([
        {
          day: 20,
          available: true,
        },
        {
          day: 22,
          available: false,
        },
      ]),
    );
  });
});
