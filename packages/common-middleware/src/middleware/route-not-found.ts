import { Application, Request, Response } from 'express';
import { HTTPStatusCodes } from '@kangojs/http-status-codes';
import { RouteNotFoundOptions } from '../types/route-not-found-options';

/**
 * A simple middleware to return a 404 response.
 */
export function useNotFoundMiddleware(app: Application, options?: RouteNotFoundOptions) {
  app.use((req: Request, res: Response) => {
    return res.status(HTTPStatusCodes.NOT_FOUND).send({
      statusCode: HTTPStatusCodes.NOT_FOUND,
      message: options && options.message ? options.message : 'The requested route was not found.'
    });
  })
}
