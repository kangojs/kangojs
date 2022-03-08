import { Response, NextFunction } from "express";

import { HTTPStatusCodes } from "@kangojs/http-status-codes";

import { RequestWithDto } from "./types/request-with-dto";
import { CreateValidatorOptions } from "./types/create-validator-options";
import { createValidator } from "./validator";
import { defaultClassTransformerOptions, defaultClassValidatorOptions } from "./types/default-options";
import { classValidatorErrorPrettier } from "./utils/class-validator-error-prettier";


/**
 * Returns a validateBody function compatible with KangoJS's validation system.
 * That returned function then contains the middleware function used to validate request body data.
 *
 * @param options
 */
export function createBodyValidator(options?: CreateValidatorOptions) {
    return function validateBody(classDto: any) {
        const validator = createValidator(
            options && options.classTransformerOptions ? options.classTransformerOptions : defaultClassTransformerOptions,
            options && options.classValidatorOptions ? options.classValidatorOptions : defaultClassValidatorOptions,
        );

        return async function validateBodyMiddleware(req: RequestWithDto, res: Response, next: NextFunction) {
            const result = await validator(classDto, req.body);
            if (result.passed) {
                // Attach any processed DTO object to the request for use later.
                if (result.dto) {
                    req.bodyDto = result.dto;
                }

                return next();
            }
            else {
                if (options && options.errorHandler) {
                    await options.errorHandler(result.error, res);
                }
                else {
                    const errorReason = classValidatorErrorPrettier(result.error);

                    return res.status(HTTPStatusCodes.BAD_REQUEST).send({
                        statusCode: HTTPStatusCodes.BAD_REQUEST,
                        message: 'The supplied body data did not pass validation.',
                        reason: errorReason ? errorReason : null,
                    })
                }
            }
        }
    }
}

/**
 * Returns a validateQuery function compatible with KangoJS's validation system.
 * That returned function then contains the middleware function used to validate request query data.
 *
 * @param options
 */
export function createQueryValidator(options?: CreateValidatorOptions) {
    return function validateQuery(classDto: any) {
        const validator = createValidator(
            options && options.classTransformerOptions ? options.classTransformerOptions : defaultClassTransformerOptions,
            options && options.classValidatorOptions ? options.classValidatorOptions : defaultClassValidatorOptions,
        );

        return async function validateQueryMiddleware(req: RequestWithDto, res: Response, next: NextFunction) {
            const result = await validator(classDto, req.query);
            if (result.passed) {
                // Attach any processed DTO object to the request for use later.
                if (result.dto) {
                    req.queryDto = result.dto;
                }

                return next();
            }
            else {
                if (options && options.errorHandler) {
                    await options.errorHandler(result.error, res);
                }
                else {
                    const errorReason = classValidatorErrorPrettier(result.error);

                    return res.status(HTTPStatusCodes.BAD_REQUEST).send({
                        statusCode: HTTPStatusCodes.BAD_REQUEST,
                        message: 'The supplied query data did not pass validation.',
                        reason: errorReason ? errorReason : null,
                    })
                }
            }
        }
    }
}

/**
 * Returns a validateParams function compatible with KangoJS's validation system.
 * That returned function then contains the middleware function used to validate request URL params.
 *
 * @param options
 */
export function createParamsValidator(options?: CreateValidatorOptions) {
    return function validateParams(classDto: any) {
        const validator = createValidator(
            options && options.classTransformerOptions ? options.classTransformerOptions : defaultClassTransformerOptions,
            options && options.classValidatorOptions ? options.classValidatorOptions : defaultClassValidatorOptions,
        );

        return async function validateParamsMiddleware(req: RequestWithDto, res: Response, next: NextFunction) {
            const result = await validator(classDto, req.params);
            if (result.passed) {
                // Attach any processed DTO object to the request for use later.
                if (result.dto) {
                    req.paramsDto = result.dto;
                }

                return next();
            }
            else {
                if (options && options.errorHandler) {
                    await options.errorHandler(result.error, res);
                }
                else {
                    const errorReason = classValidatorErrorPrettier(result.error);

                    return res.status(HTTPStatusCodes.BAD_REQUEST).send({
                        statusCode: HTTPStatusCodes.BAD_REQUEST,
                        message: 'The supplied URL parameters did not pass validation.',
                        reason: errorReason ? errorReason : null,
                    })
                }
            }
        }
    }
}
