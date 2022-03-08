import { NextFunction, Request, Response } from 'express';

/**
 * A generic middleware function for Express.
 */
export type MiddlewareFunction = (req: Request, res: Response, next: NextFunction) => any;

/**
 * A generic request validator function for use in KangoJS.
 */
export type ValidatorFunction = (shape: any) => MiddlewareFunction;

/**
 * Options that can be passed to KangoJS when it's instantiated.
 */
export interface KangoJSOptions {
  controllerFilesGlob: string;
  globalPrefix?: string;
  authValidator?: MiddlewareFunction;
  bodyValidator?: ValidatorFunction;
  queryValidator?: ValidatorFunction;
  paramsValidator?: ValidatorFunction;
}
