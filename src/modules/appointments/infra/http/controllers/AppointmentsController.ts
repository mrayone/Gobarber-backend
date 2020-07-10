import { Request, Response } from 'express';
import { container } from 'tsyringe';
import { parseISO } from 'date-fns';
import CreateAppointmentService from '@modules/appointments/services/CreateAppointmentService';
import IAppointmentsRepository from '@modules/appointments/repositories/IAppointmentsRepository';

class AppointmentsController {
  public async index(request: Request, response: Response): Promise<Response> {
    const { id: providerId } = request.user;

    const appointmentsRepository = container.resolve<IAppointmentsRepository>(
      'AppointmentsRepository',
    );
    const appointments = await appointmentsRepository.findByProviderId(
      providerId,
    );
    return response.json(appointments);
  }

  public async create(request: Request, response: Response): Promise<Response> {
    const createAppointmentService = container.resolve(
      CreateAppointmentService,
    );
    const { providerId, date } = request.body;
    const { id: userId } = request.user;
    const parsedDate = parseISO(date);

    const appointment = await createAppointmentService.execute({
      providerId,
      userId,
      date: parsedDate,
    });

    return response.json(appointment);
  }
}

export default AppointmentsController;
