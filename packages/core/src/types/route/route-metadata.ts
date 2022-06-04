import { RouteDefinition } from "./route-definition";

/**
 * Route metadata used internally by the @Route decorator
 * when adding metadata to the target object.
 */
export interface RouteMetadata {
  routeDefinition: RouteDefinition,
  methodName: string
}
