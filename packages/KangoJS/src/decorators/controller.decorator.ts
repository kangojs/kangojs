import { MetadataKeys } from './metadata-keys';

/**
 * Controller decorator used to mark a class as a controller.
 *
 * @param routePrefix - The prefix of all routes in the controller.
 * @constructor
 */
export function Controller(routePrefix: string = ''): ClassDecorator {
  return function(target: any) {
    Reflect.defineMetadata(MetadataKeys.ROUTE_PREFIX, routePrefix, target);

    // Routes metadata will most likely be set by a route decorator.
    if (!Reflect.hasMetadata(MetadataKeys.ROUTES, target)) {
      Reflect.defineMetadata(MetadataKeys.ROUTES, [], target);
    }
  };
}
