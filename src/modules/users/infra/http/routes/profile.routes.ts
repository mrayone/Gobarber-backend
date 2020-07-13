import { Router } from 'express';
import { celebrate, Segments, Joi } from 'celebrate';
import EnsureAuthenticated from '@shared/infra/http/middleware/ensureAuthenticated';
import ProfileController from '../controllers/ProfileController';

const profileRouter = Router();
const profileUserController = new ProfileController();
profileRouter.use(EnsureAuthenticated);
profileRouter.get('/', profileUserController.show);
profileRouter.put(
  '/',
  celebrate({
    [Segments.BODY]: {
      name: Joi.string().required(),
      email: Joi.string().email(),
      old_password: Joi.string(),
      password: Joi.string().when('old_password', {
        is: Joi.exist(),
        then: Joi.required(),
        otherwise: Joi.string(),
      }),
      password_confirmation: Joi.string().when('password', {
        is: Joi.exist(),
        then: Joi.required().valid(Joi.ref('password')),
        otherwise: Joi.string(),
      }),
    },
  }),
  profileUserController.update,
);

export default profileRouter;
