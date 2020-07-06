import { container } from 'tsyringe';
import { Request, Response } from 'express';
import ShowProfileUserService from '@modules/users/services/ShowProfileService';
import UpdateProfileService from '@modules/users/services/UpdateProfileService';

export default class ProfileController {
  public async show(request: Request, response: Response): Promise<Response> {
    const { id } = request.user;

    const showProfileService = container.resolve(ShowProfileUserService);
    const user = await showProfileService.execute(id);

    delete user?.password;

    return response.json(user);
  }

  public async update(request: Request, response: Response): Promise<Response> {
    const { name, email, password, old_password } = request.body;

    const { id: user_id } = request.user;

    const updateProfileService = container.resolve(UpdateProfileService);

    const user = await updateProfileService.execute({
      user_id,
      name,
      email,
      password,
      old_password,
    });

    delete user?.password;

    return response.json(user);
  }
}
