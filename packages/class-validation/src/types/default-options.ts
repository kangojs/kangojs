import {ValidatorOptions} from "class-validator";
import {ClassTransformOptions} from "class-transformer";

/**
 * Default options to be used with class-validator.
 */
export const defaultClassValidatorOptions: ValidatorOptions = {
    whitelist: true,
    forbidNonWhitelisted: true,
    forbidUnknownValues: true,
    validationError: {
        target: false
    }
}

/**
 * Default options to be used with class-transformer.
 */
export const defaultClassTransformerOptions: ClassTransformOptions = {}
