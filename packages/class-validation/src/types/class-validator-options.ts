import { TransformOptions } from "class-transformer";
import { ValidatorOptions } from "class-validator";

/**
 * Options that users can pass when creating a  data validator.
 */
export interface ClassValidatorOptions {
    classTransformerOptions?: TransformOptions,
    classValidatorOptions?: ValidatorOptions
}
