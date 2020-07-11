import { Router } from 'express';
import ensureAuthentication from '@shared/infra/http/middleware/ensureAuthenticated';
import ProvidersController from '../controllers/ProvidersController';
import ProvidersMonthAvailabilityController from '../controllers/ProvidersMonthAvailabilityController';
import ProvidersDayAvailabilityController from '../controllers/ProvidersDayAvailabilityController';

const providersController = new ProvidersController();
const providersMonthAvailabilityController = new ProvidersMonthAvailabilityController();
const providersDayAvailabilityController = new ProvidersDayAvailabilityController();
const providersRouter = Router();

providersRouter.use(ensureAuthentication);

providersRouter.get('/', providersController.index);
providersRouter.get(
  '/:id/month-availability',
  providersMonthAvailabilityController.index,
);
providersRouter.get(
  '/:id/day-availability',
  providersDayAvailabilityController.index,
);

export default providersRouter;
