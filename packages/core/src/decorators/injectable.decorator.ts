import { MetadataKeys } from "./metadata-keys";

export type InjectMode = "global" | "unique";

export interface DependencyConfig {
  injectMode?: InjectMode;
}

/**
 * Injectable decorator used to mark a class as injectable
 *
 * @constructor
 * @param config
 */
export function Injectable(config?: DependencyConfig) {
  return function(target: any) {
    const dependencyKey = Symbol.for(target.toString());
    Reflect.defineMetadata(MetadataKeys.DEPENDENCY_KEY, dependencyKey, target);

    const dependencyConfig = config ?? {mode: "global"};
    Reflect.defineMetadata(MetadataKeys.DEPENDENCY_CONFIG, dependencyConfig, target);
  };
}
