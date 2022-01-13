import { Response } from "express";
import { TransformOptions } from "class-transformer";
import { ValidatorOptions } from "class-validator";

/**
 * Options that users can pass when creating a body or query data validator.
 */
export interface CreateValidatorOptions {
    classTransformerOptions?: TransformOptions,
    classValidatorOptions?: ValidatorOptions
    errorHandler?: (error: Error, res?: Response) => Promise<void>
}
