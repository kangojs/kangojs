import { Application, NextFunction, Request, Response } from "express";
import { ErrorHandler, ErrorHandlerConfig } from "../handlers/error-handler";

/**
 * A middleware to handle all thrown errors via the main error handler.
 */
export function useErrorHandlerMiddleware(app: Application, config?: ErrorHandlerConfig) {
  const errorHandler = new ErrorHandler(config);

  async function errorHandlerMiddleware(err: Error, req: Request, res: Response, next: NextFunction) {
    await errorHandler.handleError(err, res);
  }

  app.use(errorHandlerMiddleware);
}
