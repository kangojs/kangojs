import { NextFunction, Request, Response } from 'express';
import { ErrorHandler, ErrorHandlerConfig } from '../handlers/error-handler';

export interface ErrorHandlerMiddlewareConfig {
  errorHandlerConfig: ErrorHandlerConfig
}

/**
 * A middleware to handle all thrown errors via the main error handler.
 */
export function useErrorHandlerMiddleware(config: ErrorHandlerMiddlewareConfig) {
 const errorHandler = new ErrorHandler(config.errorHandlerConfig);

  return async function errorHandlerMiddleware(err: Error, req: Request, res: Response, next: NextFunction) {
    await errorHandler.handleError(err, res);
  }
}
