import compression from 'compression';
import express, { Application, NextFunction,Request, Response } from 'express';
import helmet from 'helmet';

import enableCors from '../middlewares/CorsMiddleware';

export function configureExpressApp(app: Application): void {
  // set up middleware
  //app.use(helmet());
  app.use(enableCors());
  app.use(compression());
  app.use(express.json());
  app.use(express.urlencoded({ extended: true }));
}
