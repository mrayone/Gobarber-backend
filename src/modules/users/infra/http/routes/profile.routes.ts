import { Router } from 'express';
import EnsureAuthenticated from '@shared/infra/http/middleware/ensureAuthenticated';
import ProfileController from '../controllers/ProfileController';

const profileRouter = Router();
const profileUserController = new ProfileController();
profileRouter.use(EnsureAuthenticated);
profileRouter.get('/', profileUserController.show);
profileRouter.put('/', profileUserController.update);

export default profileRouter;
