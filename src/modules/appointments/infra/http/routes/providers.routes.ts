import { Router } from 'express';
import ensureAuthentication from '@shared/infra/http/middleware/ensureAuthenticated';
import ProvidersController from '../controllers/ProvidersController';

const providersController = new ProvidersController();
const providersRouter = Router();

providersRouter.use(ensureAuthentication);

providersRouter.get('/', providersController.index);

export default providersRouter;
