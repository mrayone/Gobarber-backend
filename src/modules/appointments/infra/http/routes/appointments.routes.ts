import { Router } from 'express';
import { parseISO } from 'date-fns';
import { container } from 'tsyringe';
import CreateAppointmentService from '@modules/appointments/services/CreateAppointmentService';
import ensureAuthentication from '@shared/infra/http/middleware/ensureAuthenticated';

const appointmentsRouter = Router();

appointmentsRouter.use(ensureAuthentication);

// appointmentsRouter.get('/', async (request, response) => {
//   // const { id: providerId } = request.user;
//   // const appointments = await this.appointmentRepository.find({
//   //   where: { providerId },
//   // });
//   // return response.json(appointments);
// });

appointmentsRouter.post('/', async (request, response) => {
  const createAppointmentService = container.resolve(CreateAppointmentService);
  const { providerId, date } = request.body;

  const parsedDate = parseISO(date);

  const appointment = await createAppointmentService.execute({
    providerId,
    date: parsedDate,
  });

  return response.json(appointment);
});

export default appointmentsRouter;
