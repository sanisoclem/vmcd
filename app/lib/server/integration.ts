// import { v4 } from 'uuid';
// import * as Model from '~/lib/model';
// import { BadRequestError, NotFoundError } from './errors';

import { IntegrationMetadata } from '../model';
import { integrationList } from './integrations';

export class IntegrationService {
  constructor(private readonly env: AppLoadContext) {}

  public static getIntegrationTypes(): IntegrationMetadata[] {
    return integrationList;
  }
}
