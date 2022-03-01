import mongooseLoader from './mongoose';
import * as express from 'express';
import expressLoader from './express';

import logger from '../logger';

// This pattern allows to add an unlimited number of loaders with just one call from the index file
export default async ({ expressApp }: { expressApp: express.Application }) :
    Promise<void> => {

  await mongooseLoader();
  logger.info('MongoDB Initialized');

  await expressLoader({ app: expressApp });
  logger.info('Express Initialized');

}
