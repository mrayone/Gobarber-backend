import { Router } from 'express';
import multer from 'multer';
import CreateUserService from '@modules/users/services/CreateUserService';
import UpdateUserAvatarService from '@modules/users/services/UpdateUserAvatarService';
import ensureAuthenticated from '@shared/infra/http/middleware/ensureAuthenticated';
import uploadConfig from '@shared/config/upload';
import UserRepository from '../../typeorm/repositories/UserRepository';

const usersRouter = Router();
const upload = multer(uploadConfig);
usersRouter.post('/', async (request, response) => {
  const { name, email, password } = request.body;
  const userRepository = new UserRepository();

  const createUserService = new CreateUserService(userRepository);
  const user = await createUserService.execute({
    name,
    email,
    password,
  });

  return response.json(user);
});

usersRouter.patch(
  '/avatar',
  ensureAuthenticated,
  upload.single('avatar'),
  async (request, response) => {
    const userRepository = new UserRepository();

    const { id: user_id } = request.user;
    const updateUserAvatarService = new UpdateUserAvatarService(userRepository);

    const user = await updateUserAvatarService.execute({
      user_id,
      avatarFileName: request.file.filename,
    });

    return response.json(user);
  },
);

export default usersRouter;
