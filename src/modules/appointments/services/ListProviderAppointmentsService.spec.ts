import FakeAppointmentsRepository from '../repositories/fakes/FakeAppointmentsRepository';
import ListProviderAppointmentsService from './ListProviderAppointmentsService';

let fakeAppointmentsRepository: FakeAppointmentsRepository;
let listProviderAppointmentsService: ListProviderAppointmentsService;

describe('ListProviderAppointmentsService', () => {
  beforeEach(() => {
    fakeAppointmentsRepository = new FakeAppointmentsRepository();
    listProviderAppointmentsService = new ListProviderAppointmentsService(
      fakeAppointmentsRepository,
    );
  });

  it('Should be able to list the day appointments from provider', async () => {
    const appointment1 = await fakeAppointmentsRepository.save({
      providerId: 'provider',
      userId: 'user',
      date: new Date(2020, 6, 12, 8),
    });

    const appointment2 = await fakeAppointmentsRepository.save({
      providerId: 'provider',
      userId: 'user',
      date: new Date(2020, 6, 12, 9),
    });

    const appointments = await listProviderAppointmentsService.execute({
      day: 12,
      month: 7,
      year: 2020,
      provider_id: 'provider',
    });

    expect(appointments).toEqual([appointment1, appointment2]);
  });
});
