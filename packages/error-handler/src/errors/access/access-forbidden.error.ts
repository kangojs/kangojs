import { UserError } from '../user.error';

/**
 * For use when a party is authorized but is not allowed access to a resource.
 */
export class AccessForbiddenError extends UserError {}
