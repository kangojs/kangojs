import { MetadataKeys } from "./metadata-keys";

/**
 * Controller decorator used to mark a class as a controller.
 *
 * @param routePrefix - The prefix of all routes in the controller.
 * @constructor
 */
export function Controller(routePrefix = ""): ClassDecorator {
  return function(target: any) {
    Reflect.defineMetadata(MetadataKeys.ROUTE_PREFIX, routePrefix, target);

    // Routes metadata will most likely be set by a route decorator.
    if (!Reflect.hasMetadata(MetadataKeys.ROUTES, target)) {
      Reflect.defineMetadata(MetadataKeys.ROUTES, [], target);
    }

    // Automatically setup dependency metadata here so users don't need to add @Injectable to controllers
    const dependencyKey = Symbol.for(target.toString());
    Reflect.defineMetadata(MetadataKeys.DEPENDENCY_KEY, dependencyKey, target);
    Reflect.defineMetadata(MetadataKeys.DEPENDENCY_CONFIG, {mode: "global"}, target);
  };
}
