import { Application, NextFunction, Request, Response } from "express";
import {MalformedRequestOptions} from "../types/middleware/malformed-request-options";
import {HTTPStatusCodes} from "../enums/http-status-codes";
import {ErrorIdentifiers} from "../errors/error-identifiers";

/**
 * A simple middleware to return a 400 response when an error occurs.
 */
export function useMalformedRequestMiddleware(app: Application, options?: MalformedRequestOptions) {
  app.use((err: Error, req: Request, res: Response, next: NextFunction) => {
    return res.status(HTTPStatusCodes.BAD_REQUEST).send({
      identifier: ErrorIdentifiers.USER_REQUEST_INVALID,
      statusCode: HTTPStatusCodes.BAD_REQUEST,
      message: options && options.message ? options.message : "The request data appears malformed."
    });
  });
}
