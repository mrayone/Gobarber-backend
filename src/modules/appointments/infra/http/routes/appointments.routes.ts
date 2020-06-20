import { Router } from 'express';
import { container } from 'tsyringe';
import ensureAuthentication from '@shared/infra/http/middleware/ensureAuthenticated';
import AppointmentsController from '../controllers/AppointmentsController';

const appointmentsController = container.resolve(AppointmentsController);
const appointmentsRouter = Router();

appointmentsRouter.use(ensureAuthentication);

appointmentsRouter.get('/', appointmentsController.index);

appointmentsRouter.post('/', appointmentsController.create);

export default appointmentsRouter;
