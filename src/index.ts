import loaders = require('./loaders');
import express = require('express');
import config from './config';

import logger from './logger';

// Very basic index file. Let the loaders initiate stuff and open the connection
async function startServer() {

  const app = express();
  await loaders.default({ expressApp: app });

  app.listen(config.port, () => {
      logger.info(`
        ################################################
        #  Server listening on port: ${config.port}    #
        ################################################
      `);
    }).on('error', (err) => {
      logger.error(err);
      process.exit(1);
    });
}

startServer();
