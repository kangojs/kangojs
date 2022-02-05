import { ValidationError } from "class-validator";

/**
 * Prettify errors returned by class-validator.
 * @param validationError
 */
export function classValidatorErrorPrettier(validationError: ValidationError|ValidationError[]): string[]|string|null {
    if (Array.isArray(validationError)) {
        const prettifiedErrors = [];

        for (const error of validationError) {
            if (error.constraints) {
                prettifiedErrors.push(Object.values(error.constraints).join(", "));
            }
        }

        return prettifiedErrors.length > 0 ? prettifiedErrors: null;
    }
    else if (validationError.constraints) {
        return Object.values(validationError.constraints).join(", ");
    }

    return null;
}
