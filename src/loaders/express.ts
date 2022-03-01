import * as express from 'express';
import * as bodyParser from 'body-parser';
import path = require('path');
import logger from '../logger';
import routes from '../routes';

// Setup all the routing logic
export default async ({ app }: { app: express.Application }) : Promise<express.Application> => {

  app.use(bodyParser.urlencoded({ extended: false }));
  app.use(bodyParser.json());

  app.get('/status', (req, res) => { res.status(200).end(); });
  app.head('/status', (req, res) => { res.status(200).end(); });

  // Load API routes
  app.use('/api', routes);
  app.use(bodyParser.urlencoded({ extended: true }));

  app.get(['/*.js', '/*.png', '/*.gif', '/static/*.css'], (req, res) => {
      logger.debug('app.get resource ' + req.url);
      res.sendFile(path.join(__dirname, '../../client/build', req.url));
      //app.use('/', express.static(path.join(__dirname, '/')));
  });

  app.get('/', (req, res) => {
      logger.debug('app.get ' + req.url);
      res.sendFile(path.join(__dirname, '../../client/build', 'index.html'));
  });

  app.use((error:Error, req:any, res:any, next:any) => {

    logger.error(error.constructor.name);
    res.status(400);
    res.send(error);

  });

  // Return the express app
  return app;
};
