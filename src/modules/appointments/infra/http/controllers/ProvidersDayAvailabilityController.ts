import { Request, Response } from 'express';
import { container } from 'tsyringe';
import ListProviderDayAvailability from '@modules/appointments/services/ListProviderDayAvailability';

class ProvidersDayAvailabilityController {
  public async index(request: Request, response: Response): Promise<Response> {
    const { id: provider_id } = request.params;
    const { year, month, day } = request.body;

    const listProviderDayAvailability = container.resolve(
      ListProviderDayAvailability,
    );
    const monthAvailability = await listProviderDayAvailability.execute({
      provider_id,
      day,
      month,
      year,
    });

    return response.json(monthAvailability);
  }
}

export default ProvidersDayAvailabilityController;
