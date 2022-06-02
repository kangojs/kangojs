import {MetadataKeys} from "../decorators/metadata-keys";
import {DependencyConfig} from "../decorators/injectable.decorator";

/**
 * The interface for a single dependency
 */
export interface StoredDependency {
  signature: any,
  instance?: any,
}

/**
 * The interface for the dependency store itself.
 */
export interface DependencyStore {
  [key: symbol]: StoredDependency;
}

/**
 * An IoC container for managing the registration and retrieval of dependencies.
 */
export class DependencyContainer {
  private dependencyStore: DependencyStore = {};

  /**
   * Get the dependency key attached to the metadata if it exists.
   * @param dependency
   */
  getDependencyKey(dependency: any): symbol | undefined {
    return <symbol> Reflect.getMetadata(MetadataKeys.DEPENDENCY_KEY, dependency);
  }

  /**
   * Get the dependency config attached to the metadata if it exists.
   * @param dependency
   */
  getDependencyConfig(dependency: any): DependencyConfig | undefined {
    return <DependencyConfig> Reflect.getMetadata(MetadataKeys.DEPENDENCY_CONFIG, dependency);
  }

  /**
   * Use the supplied dependency via the IoC container.
   * This method will register the dependency or retrieve the existing dependency if already registered,
   * 
   * @param dependency
   */
  useDependency<T>(dependency: any): T {
    const dependencyKey = this.getDependencyKey(dependency);

    // To prevent possible issues only accept dependencies that are explicitly marked as injectable
    if (!dependencyKey) {
      throw new Error("You can't use a dependency that isn't marked as injectable");
    }

    // Register the dependency if it doesn't already exist.
    if (!(dependencyKey in this.dependencyStore)) {
      this.registerDependency(dependencyKey, dependency);
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
  private registerDependency(dependencyKey: symbol, dependency: any) {
    const dependencyConfig = this.getDependencyConfig(dependency);

    if (dependencyConfig?.injectMode === "global") {
      this.createInstance(dependencyKey, dependency);
    }
    else {
      this.dependencyStore[dependencyKey] = {
        signature: dependency
      };
    }
  }

  /**
   * Return the dependency for the given key
   *
   * @private
   * @param dependencyKey
   */
  private returnDependency<T>(dependencyKey: any): T {
    const storedDependency = this.dependencyStore[dependencyKey];
    const storedDependencyConfig = this.getDependencyConfig(storedDependency.signature);

    if (storedDependencyConfig?.injectMode === "global") {
      return this.dependencyStore[dependencyKey].instance as T;
    }
    else {
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
  private createInstance(dependencyKey: symbol, dependency: any) {
    const constructorArguments: any[] = [];

    for (const constructorArgument in dependency.arguments) {
      const constructorArgumentKey = <symbol> Reflect.getMetadata(MetadataKeys.DEPENDENCY_KEY, constructorArgument);

      if (!constructorArgumentKey) {
        constructorArguments.push(constructorArgument);
      }
      else {
        constructorArguments.push(
          this.useDependency(dependency)
        );
      }
    }

    this.dependencyStore[dependencyKey] = {
      signature: dependency,
      instance: new dependency(...constructorArguments)
    };
  }

  /**
   * Override the given dependency with a new one.
   * This can be used for overriding default dependencies for things like testing or custom implementations.
   *
   * @param dependency
   * @param dependencyOverride
   */
  overwriteDependency(dependency: any, dependencyOverride: any) {
    const dependencyKey = this.getDependencyKey(dependency);
    const dependencyOverrideConfig = this.getDependencyConfig(dependencyOverride);

    if (!dependencyKey) {
      throw new Error("You can't override a dependency that isn't marked as injectable as it can never be used");
    }
    if (!dependencyOverrideConfig) {
      throw new Error("You can't override a dependency with one that isn't marked as injectable");
    }

    this.registerDependency(dependencyKey, dependencyOverride);
  }
}
