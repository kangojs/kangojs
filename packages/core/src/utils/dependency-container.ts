import {MetadataKeys} from "../decorators/metadata-keys";
import {DependencyConfig} from "../decorators/injectable.decorator";

/**
 * The interface for the dependency store itself.
 */
export interface Dependencies {
  [key: symbol]: any;
}

/**
 * An IoC container for managing the registration and retrieval of dependencies.
 */
export class DependencyContainer {
  private dependencies: Dependencies = {};

  /**
   * Use the supplied dependency via the IoC container.
   * This method will register the dependency or retrieve the existing dependency if already registered,
   * 
   * @param dependency
   */
  useDependency<T>(dependency: any): T {
    const dependencyKey = <symbol> Reflect.getMetadata(MetadataKeys.DEPENDENCY_KEY, dependency);

    if (!dependencyKey) {
      throw new Error("Dependency requested that isn't marked as injectable");
    }

    const dependencyConfig = <DependencyConfig> Reflect.getMetadata(MetadataKeys.DEPENDENCY_CONFIG, dependency);

    // Register the dependency if it doesn't already exist.
    if (!(dependencyKey in this.dependencies)) {
      if (dependencyConfig.injectMode === "global") {
        this.createInstance(dependency, dependencyKey);
      }
      else {
        this.dependencies[dependencyKey] = dependency;
      }
    }

    return this.returnDependency<T>(dependencyKey, dependencyConfig);
  }

  /**
   * Return the dependency for the given key
   *
   * @param dependencyKey
   * @param dependencyConfig
   * @private
   */
  private returnDependency<T>(dependencyKey: symbol, dependencyConfig: DependencyConfig): T {
    if (dependencyConfig.injectMode === "global") {
      return this.dependencies[dependencyKey] as T;
    }
    else {
      return new this.dependencies[dependencyKey] as T;
    }
  }

  /**
   * Create an instance of the given dependency, recursively injecting child dependencies too.
   *
   * @param dependency
   * @param dependencyKey
   * @private
   */
  private createInstance(dependency: any, dependencyKey: symbol) {
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

    this.dependencies[dependencyKey] = new dependency(...constructorArguments);
  }
}
