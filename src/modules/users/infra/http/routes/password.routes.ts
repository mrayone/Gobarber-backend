import { Router } from 'express';
import ForgotPassowordController from '../controllers/ForgotPasswordControler';
import ResetPasswordController from '../controllers/ResetPasswordController';

const passwordRouter = Router();
const forgotPasswordController = new ForgotPassowordController();
const resetPasswordController = new ResetPasswordController();
passwordRouter.post('/forgot', forgotPasswordController.create);
passwordRouter.post('/reset', resetPasswordController.create);

export default passwordRouter;
