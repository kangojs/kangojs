import { MetadataKeys } from "./metadata-keys";
import { RouteDefinition } from "../types/route/route-definition";
import { RouteMetadata } from "../types/route/route-metadata";

/**
 * Route decorator used to mark a controller method as a route.
 *
 * @param routeDefinition - The route data including path, HTTP method etc.
 * @constructor
 */
export function Route(routeDefinition: RouteDefinition) {
  return function (target: Object, propertyKey: string) {
    // Define the 'routes' metadata if it doesn't already exist.
    // This will only be the case for the first route decorator that's processed.
    if (!Reflect.hasMetadata(MetadataKeys.ROUTES, target.constructor)) {
      Reflect.defineMetadata(MetadataKeys.ROUTES, [], target.constructor);
    }

    // Add the new route to the 'routes' metadata that exists on the target object.
    const routes = Reflect.getMetadata(MetadataKeys.ROUTES, target.constructor) as Array<RouteMetadata>;
    routes.push({
      methodName: propertyKey,
      routeDefinition
    });

    Reflect.defineMetadata(MetadataKeys.ROUTES, routes, target.constructor);
  };
}
