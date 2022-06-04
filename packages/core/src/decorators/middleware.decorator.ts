import { MetadataKeys } from "./metadata-keys";

export type MiddlewareLayer = "before-controllers" | "after-controllers";

/**
 * Defines the configuration allowed for the @Middleware decorator.
 */
export interface MiddlewareConfig {
  identifier?: string;
  route?: string;
  layer?: MiddlewareLayer
}

/**
 * Middleware decorator used to mark a class as a middleware.
 *
 * @constructor
 */
export function Middleware(config?: MiddlewareConfig) {
  return function(target: any) {
    // Automatically setup dependency metadata here so users don't need to add @Injectable to controllers
    const dependencyKey = config?.identifier
      ? Symbol.for(config.identifier)
      : Symbol.for(target.toString());
    Reflect.defineMetadata(MetadataKeys.DEPENDENCY_KEY, dependencyKey, target.prototype);

    const middlewareConfig: MiddlewareConfig = config ?? {route: "/*", layer: "after-controllers"};
    Reflect.defineMetadata(MetadataKeys.MIDDLEWARE_CONFIG, middlewareConfig, target.prototype);
  };
}
