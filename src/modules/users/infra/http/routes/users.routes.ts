import { Router } from 'express';
import { container } from 'tsyringe';
import multer from 'multer';
import CreateUserService from '@modules/users/services/CreateUserService';
import UpdateUserAvatarService from '@modules/users/services/UpdateUserAvatarService';
import ensureAuthenticated from '@shared/infra/http/middleware/ensureAuthenticated';
import uploadConfig from '@shared/config/upload';

const usersRouter = Router();
const upload = multer(uploadConfig);
usersRouter.post('/', async (request, response) => {
  const { name, email, password } = request.body;

  const createUserService = container.resolve(CreateUserService);
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
    const { id: user_id } = request.user;
    const updateUserAvatarService = container.resolve(UpdateUserAvatarService);

    const user = await updateUserAvatarService.execute({
      user_id,
      avatarFileName: request.file.filename,
    });

    return response.json(user);
  },
);

export default usersRouter;