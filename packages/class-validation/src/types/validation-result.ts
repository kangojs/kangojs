/**
 * The validation result returned by the validator.
 */
export interface ValidationResult {
    passed: boolean,
    error?: any,
    dto?: any,
}
