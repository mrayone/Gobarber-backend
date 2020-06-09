import { Router } from 'express';
import { parseISO } from 'date-fns';
import { getCustomRepository } from 'typeorm';
import CreateAppointmentService from '@modules/appointments/services/CreateAppointmentService';
import AppointmentRepository from '@modules/appointments/repositories/AppointmentsRepository';
import ensureAuthentication from '@shared/infra/http/middleware/ensureAuthenticated';

const appointmentsRouter = Router();
const createAppointmentService = new CreateAppointmentService();

appointmentsRouter.use(ensureAuthentication);

appointmentsRouter.get('/', async (request, response) => {
  const { id: providerId } = request.user;
  const appointmentRepository = getCustomRepository(AppointmentRepository);
  const appointments = await appointmentRepository.find({
    where: { providerId },
  });

  return response.json(appointments);
});

appointmentsRouter.post('/', async (request, response) => {
  const { providerId, date } = request.body;

  const parsedDate = parseISO(date);

  const appointment = await createAppointmentService.execute({
    providerId,
    date: parsedDate,
  });

  return response.json(appointment);
});

export default appointmentsRouter;
