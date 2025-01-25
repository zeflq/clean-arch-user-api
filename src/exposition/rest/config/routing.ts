import path from 'path';
import { useContainer } from 'routing-controllers';
import { Container } from 'typedi';

import { UserController } from '../controllers/User/UserController';

useContainer(Container);

export const routingConfig = {
  controllers: [UserController],
  middlewares: [path.join(__dirname, '../middlewares/**/*.{ts,js}')],
  // routePrefix: '/api/',
  defaultErrorHandler: false,
};
