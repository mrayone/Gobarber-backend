import { Request, Response } from 'express';
import { container } from 'tsyringe';
import ListProviderMonthAvailability from '@modules/appointments/services/ListProviderMonthAvailability';

class ProvidersMonthAvailabilityController {
  public async index(request: Request, response: Response): Promise<Response> {
    const { id: provider_id } = request.params;
    const { year, month } = request.body;

    const listProviderMonthAvailability = container.resolve(
      ListProviderMonthAvailability,
    );
    const monthAvailability = await listProviderMonthAvailability.execute({
      provider_id,
      month,
      year,
    });

    return response.json(monthAvailability);
  }
}

export default ProvidersMonthAvailabilityController;
