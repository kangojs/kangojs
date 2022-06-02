import {MetadataKeys} from "../decorators/metadata-keys";
import {DependencyConfig} from "../decorators/injectable.decorator";
import {Logger} from "./logger";
import {LoggerBase} from "../types/logger-interface";


/**
 * An interface for something that is instantiable.
 */
interface Instantiable<T> {
  new(...args: any[]): T;
}

/**
 * The interface for a single dependency
 */
export interface StoredDependency<T> {
  signature: Instantiable<T>,
  instance?: T,
}

/**
 * The interface for the dependency store itself.
 */
export interface DependencyStore {
  [key: symbol]: StoredDependency<any>;
}

/**
 * An IoC container for managing the registration and retrieval of dependencies.
 */
export class DependencyContainer {
  private dependencyStore: DependencyStore = {};
  private readonly logger: LoggerBase;

  constructor() {
    // Manually create the logger dependency to ensure it exists immediately
    this.logger = new Logger();
    this.dependencyStore[Symbol.for(Logger.toString())] = {
      signature: Logger,
      instance: this.logger
    };
  }

  /**
   * Get the dependency key attached to the metadata if it exists.
   * @param dependency
   */
  getDependencyKey<T>(dependency: Instantiable<T>): symbol | undefined {
    return <symbol> Reflect.getMetadata(MetadataKeys.DEPENDENCY_KEY, dependency.prototype);
  }

  /**
   * Get the dependency config attached to the metadata if it exists.
   * @param dependency
   */
  getDependencyConfig<T>(dependency: Instantiable<T>): DependencyConfig | undefined {
    return <DependencyConfig> Reflect.getMetadata(MetadataKeys.DEPENDENCY_CONFIG, dependency.prototype);
  }

  /**
   * Use the supplied dependency via the IoC container.
   * This method will register the dependency or retrieve the existing dependency if already registered,
   * 
   * @param dependency
   */
  useDependency<T>(dependency: Instantiable<T>): T {
    const dependencyKey = this.getDependencyKey(dependency);

    // To prevent possible issues only accept dependencies that are explicitly marked as injectable
    if (!dependencyKey) {
      throw new Error("You can't use a dependency that isn't marked as injectable");
    }

    // Register the dependency if it doesn't already exist.
    if (!(dependencyKey in this.dependencyStore)) {
      this.registerDependency<T>(dependencyKey, dependency);
    }

    return this.returnDependency<T>(dependencyKey);
  }

  /**
   * Register the given dependency to the container
   *
   * @param dependencyKey
   * @param dependency
   * @private
   */
  private registerDependency<T>(dependencyKey: symbol, dependency: Instantiable<T>) {
    const dependencyConfig = this.getDependencyConfig(dependency);

    if (dependencyConfig?.injectMode === "singleton") {
      this.createInstance<T>(dependencyKey, dependency);
    }
    else {
      this.dependencyStore[dependencyKey] = {
        signature: dependency
      };

      this.logger.log({
        origin: "DependencyContainer",
        message: `Registered unique dependency ${String(dependencyKey)}`
      });
    }
  }

  /**
   * Return the dependency for the given key
   *
   * @private
   * @param dependencyKey
   */
  private returnDependency<T>(dependencyKey: symbol): T {
    const storedDependency = this.dependencyStore[dependencyKey];
    const storedDependencyConfig = this.getDependencyConfig<T>(storedDependency.signature);

    if (storedDependencyConfig?.injectMode === "singleton") {
      this.logger.log({
        origin: "DependencyContainer",
        message: `Returning existing instance of ${String(dependencyKey)}`
      });

      return this.dependencyStore[dependencyKey].instance as T;
    }
    else {
      this.logger.log({
        origin: "DependencyContainer",
        message: `Returning new instance of ${String(dependencyKey)}`
      });

      return new this.dependencyStore[dependencyKey].signature as T;
    }
  }

  /**
   * Create an instance of the given dependency, recursively injecting child dependencies too.
   *
   * @param dependency
   * @param dependencyKey
   * @private
   */
  private createInstance<T>(dependencyKey: symbol, dependency: Instantiable<T>) {
    const constructorArguments: any[] = [];
    const argumentTypes = <any[]> Reflect.getMetadata("design:paramtypes", dependency) ?? [];

    for (const constructorArgument in argumentTypes) {
      const constructorArgumentKey = <symbol> Reflect.getMetadata(MetadataKeys.DEPENDENCY_KEY, constructorArgument);

      if (!constructorArgumentKey) {
        constructorArguments.push(constructorArgument);
      }
      else {
        constructorArguments.push(
          this.useDependency<T>(dependency)
        );
      }
    }

    this.dependencyStore[dependencyKey] = {
      signature: dependency,
      instance: new dependency(...constructorArguments)
    };

    this.logger.log({
      origin: "DependencyContainer",
      message: `Registered singleton dependency ${String(dependencyKey)}`
    });
  }

  /**
   * Override the given dependency with a new one.
   * This can be used for overriding default dependencies for things like testing or custom implementations.
   *
   * // todo: is there a way to make this properly type safe?
   *    so ideally you would only be able to pass a dependencyOverride that matches types with dependency
   *
   * @param dependency
   * @param dependencyOverride
   */
  overrideDependency<T>(dependency: Instantiable<T>, dependencyOverride: Instantiable<T>) {
    const dependencyKey = this.getDependencyKey<T>(dependency);
    const dependencyOverrideConfig = this.getDependencyConfig<T>(dependencyOverride);

    if (!dependencyKey) {
      throw new Error("You can't override a dependency that isn't marked as injectable as it can never be used");
    }
    if (!dependencyOverrideConfig) {
      throw new Error("You can't override a dependency with one that isn't marked as injectable");
    }

    this.registerDependency<T>(dependencyKey, dependencyOverride);
  }
}
