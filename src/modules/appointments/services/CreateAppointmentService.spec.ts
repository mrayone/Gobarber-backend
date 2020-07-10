import AppError from '@shared/errors/AppError';
import CreateAppointmentService from './CreateAppointmentService';
import FakeAppointmentsRepository from '../repositories/fakes/FakeAppointmentsRepository';

describe('CreateAppointment', () => {
  it('Should be able to create a new appointment', async () => {
    const fakeAppointmentsRepository = new FakeAppointmentsRepository();
    const createAppointmentService = new CreateAppointmentService(
      fakeAppointmentsRepository,
    );

    const providerId = '1213131444';
    const userId = '123213213';
    const appointment = await createAppointmentService.execute({
      date: new Date(),
      userId,
      providerId,
    });

    expect(appointment).toHaveProperty('id');
    expect(appointment?.providerId).toBe(providerId);
  });

  it('Should not be able create two appointments on the same time', async () => {
    const fakeAppointmentsRepository = new FakeAppointmentsRepository();
    const createAppointmentService = new CreateAppointmentService(
      fakeAppointmentsRepository,
    );

    const providerId = '1213131444';
    const userId = '123213213';
    const date = new Date(2020, 6, 20, 11);
    await createAppointmentService.execute({
      date,
      userId,
      providerId,
    });

    expect(
      createAppointmentService.execute({
        date,
        userId,
        providerId,
      }),
    ).rejects.toBeInstanceOf(AppError);
  });
});
