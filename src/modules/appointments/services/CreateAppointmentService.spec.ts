import AppError from '@shared/errors/AppError';
import CreateAppointmentService from './CreateAppointmentService';
import FakeAppointmentsRepository from '../repositories/fakes/FakeAppointmentsRepository';

let fakeAppointmentsRepository: FakeAppointmentsRepository;
let createAppointmentService: CreateAppointmentService;

describe('CreateAppointment', () => {
  beforeEach(() => {
    fakeAppointmentsRepository = new FakeAppointmentsRepository();
    createAppointmentService = new CreateAppointmentService(
      fakeAppointmentsRepository,
    );
  });

  it('Should be able to create a new appointment', async () => {
    const providerId = 'provider-id';
    const userId = 'user-id';

    jest.spyOn(Date, 'now').mockImplementationOnce(() => {
      return new Date(2020, 6, 9, 10).getTime();
    });

    const appointment = await createAppointmentService.execute({
      date: new Date(2020, 6, 9, 11),
      userId,
      providerId,
    });

    expect(appointment).toHaveProperty('id');
    expect(appointment?.providerId).toBe(providerId);
  });

  it('Should not be able create two appointments on the same time', async () => {
    const providerId = 'provider-id';
    const userId = 'user-id';
    const date = new Date(2020, 6, 20, 11);

    jest.spyOn(Date, 'now').mockImplementationOnce(() => {
      return new Date(2020, 6, 20, 8).getTime();
    });

    await fakeAppointmentsRepository.save({
      date,
      userId,
      providerId,
    });

    await expect(
      createAppointmentService.execute({
        date,
        userId,
        providerId,
      }),
    ).rejects.toBeInstanceOf(AppError);
  });

  it('Should not be able to create an appointments on a past date', async () => {
    const providerId = 'provider-id';
    const userId = 'user-id';
    const date = new Date(2020, 6, 9, 11);

    jest.spyOn(Date, 'now').mockImplementationOnce(() => {
      return new Date(2020, 6, 9, 12).getTime();
    });

    await expect(
      createAppointmentService.execute({
        date,
        userId,
        providerId,
      }),
    ).rejects.toBeInstanceOf(AppError);
  });

  it("Should not be able to create appointment when provider's yourself", async () => {
    const providerId = 'provider-id';
    const userId = 'provider-id';
    const date = new Date(2020, 6, 9, 11);

    jest.spyOn(Date, 'now').mockImplementationOnce(() => {
      return new Date(2020, 6, 9, 8).getTime();
    });

    await expect(
      createAppointmentService.execute({
        date,
        userId,
        providerId,
      }),
    ).rejects.toBeInstanceOf(AppError);
  });

  it('Should not be able to create appointment outside of 8am and 5pm', async () => {
    const providerId = 'provider-id';
    const userId = 'user-id';

    jest.spyOn(Date, 'now').mockImplementationOnce(() => {
      return new Date(2020, 6, 9).getTime();
    });

    await expect(
      createAppointmentService.execute({
        date: new Date(2020, 6, 9, 7),
        userId,
        providerId,
      }),
    ).rejects.toBeInstanceOf(AppError);

    await expect(
      createAppointmentService.execute({
        date: new Date(2020, 6, 9, 18),
        userId,
        providerId,
      }),
    ).rejects.toBeInstanceOf(AppError);
  });
});
