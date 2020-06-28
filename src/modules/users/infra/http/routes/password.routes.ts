import { Router } from 'express';
import ForgotPassowordController from '../controllers/ForgotPasswordControler';

const passwordRouter = Router();
const forgotPasswordController = new ForgotPassowordController();
passwordRouter.post('/forgot', forgotPasswordController.create);
passwordRouter.post('/reset', forgotPasswordController.create);

export default passwordRouter;
