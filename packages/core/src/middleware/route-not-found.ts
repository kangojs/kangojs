import { Application, Request, Response } from "express";
import {RouteNotFoundOptions} from "../types/middleware/route-not-found-options";
import {HTTPStatusCodes} from "../enums/http-status-codes";
import {ErrorIdentifiers} from "../errors/error-identifiers";

/**
 * A simple middleware to return a 404 response.
 */
export function useNotFoundMiddleware(app: Application, options?: RouteNotFoundOptions) {
  app.use(options?.path || "/", (req: Request, res: Response) => {
    return res.status(HTTPStatusCodes.NOT_FOUND).send({
      identifier: ErrorIdentifiers.NOT_FOUND,
      statusCode: HTTPStatusCodes.NOT_FOUND,
      message: options?.message || "The requested route was not found."
    });
  });
}
