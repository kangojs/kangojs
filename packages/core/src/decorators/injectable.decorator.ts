import { MetadataKeys } from "./metadata-keys";

export type InjectMode = "singleton" | "unique";

/**
 * Defines the configuration allowed for the @Injectable decorator.
 *
 * injectMode - Defines how the dependency should be injected
 * identifier - Allows a custom identifier which is converted to the dependency key with Symbol.for
 */
export interface DependencyConfig {
  injectMode?: InjectMode;
  identifier?: string;
}

/**
 * Injectable decorator used to mark a class as injectable.
 *
 * @constructor
 * @param config
 */
export function Injectable(config?: DependencyConfig) {
  return function(target: any) {
    const dependencyKey = config?.identifier
      ? Symbol.for(config.identifier)
      : Symbol.for(target.toString());
    Reflect.defineMetadata(MetadataKeys.DEPENDENCY_KEY, dependencyKey, target.prototype);

    const dependencyConfig = config ?? {mode: "global"};
    Reflect.defineMetadata(MetadataKeys.DEPENDENCY_CONFIG, dependencyConfig, target.prototype);
  };
}
