import { Response } from "express";

import { HTTPStatusCodes } from "@kangojs/http-status-codes";

import { UseServeSPAOptions } from "./types/use-serve-spa-options";

/**
 * Handle errors that could occur while serving SPA files.
 *
 * @param options
 * @param error
 * @param res
 */
export async function handleError(options: UseServeSPAOptions, error: Error, res: Response) {
  if (options.errorhandler) {
    return await options.errorhandler(error, res);
  }
  else {
    return res.status(HTTPStatusCodes.INTERNAL_SERVER_ERROR).send(
      options.fallbackMessage || "There has been an unexpected error loading this page. Please try again later."
    );
  }
}
