import {
  ExpressErrorMiddlewareInterface,
  HttpError,
  Middleware,
} from 'routing-controllers';
import { Service } from 'typedi';

@Middleware({ type: 'after' })
@Service()
export class HttpErrorHandler implements ExpressErrorMiddlewareInterface {
  error(error: any, _request: any, response: any, next: (err: any) => any) {
    if (error instanceof HttpError) {
      return response.status(error.httpCode).json(error);
    }
    next(error);
  }
}
