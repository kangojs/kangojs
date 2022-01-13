import { ValidationError } from "class-validator";

/**
 * Prettify errors returned by class-validator.
 * @param err
 */
export function classValidatorErrorPrettier(err: ValidationError): string|null {
    if (err.constraints) {
        return Object.values(err.constraints).join(", ");
    }
    return null;
}
