import { Request, Response } from 'express';
import { container } from 'tsyringe';
import ListProvidersService from '@modules/appointments/services/ListProvidersService';

class ProvidersController {
  public async index(request: Request, response: Response): Promise<Response> {
    const { id: providerId } = request.user;

    const listProvidersService = container.resolve(ListProvidersService);
    let providers = await listProvidersService.execute(providerId);

    providers = providers.map(provider => {
      const providerWithoutPassword = provider;
      delete providerWithoutPassword.password;
      return providerWithoutPassword;
    });

    return response.json(providers);
  }
}

export default ProvidersController;
