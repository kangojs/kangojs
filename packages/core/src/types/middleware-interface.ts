import { NextFunction, Request, Response } from "express";

/**
 * A generic Express middleware function type.
 */
export type MiddlewareFunction = (req: Request, res: Response, next: NextFunction) => any;

/**
 * A middleware factory class to allow for middleware dependency injection.
 * The middleware itself should be defined in the .run method.
 */
export abstract class MiddlewareFactory {
  abstract run: MiddlewareFunction
}

/**
 * Request validator classes to allow for dependency injection.
 *
 * This abstracts away the idea of validator middleware and instead implements a .validate method
 * which will be called in a KangoJS managed middleware.
 */
export type ValidatorFunction = (shape: any, data: any) => boolean | ValidationResult;

export abstract class RequestValidator {
  abstract validate: ValidatorFunction
}

export interface ValidationResult {
  valid: boolean,
  failReason?: string
}

/**
 * A generic Express error middleware function type.
 */
export type ErrorMiddlewareFunction = (err: Error, req: Request, res: Response, next: NextFunction) => any;
