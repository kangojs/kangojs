import { UserError } from '../user.error';

/**
 * For use when a party is unauthorized and not allowed access to a resource.
 */
export class AccessDeniedError extends UserError {}
