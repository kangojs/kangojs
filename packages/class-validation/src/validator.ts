import { ValidationResult } from "./types/validation-result";
import { plainToInstance, TransformOptions } from "class-transformer";
import { validate, ValidatorOptions } from "class-validator";


/**
 * A factory function to return the validator function used to check if a class is valid.
 *
 * @param classTransformerOptions
 * @param classValidatorOptions
 */
export function createValidator(classTransformerOptions: TransformOptions, classValidatorOptions: ValidatorOptions) {
    return async function validator(dtoClass: any, data: any): Promise<ValidationResult> {
        const dto = plainToInstance(
            dtoClass,
            data,
            classTransformerOptions
        );

        const errors = await validate(dto);

        if (errors.length > 0) {
            return {
                passed: false,
                error: errors,
            }
        }

        return {
            passed: true,
            dto: dto,
        }
    }
}
