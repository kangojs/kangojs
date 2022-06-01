/* eslint-disable @typescript-eslint/no-explicit-any */

import {MetadataKeys} from "../decorators/metadata-keys";
import {DependencyConfig} from "../decorators/injectable.decorator";

export type GenericClass = any;

export interface Dependencies {
  [key: symbol]: any;
}

export class DependencyContainer {
  private dependencies: Dependencies = {};

  getDependency<T>(dependency: GenericClass): T {
    const dependencyKey = <symbol> Reflect.getMetadata(MetadataKeys.DEPENDENCY_KEY, dependency);

    if (!dependencyKey) {
      throw new Error("Dependencies registered to KangoJS must be marked as injectable");
    }

    const dependencyConfig = <DependencyConfig> Reflect.getMetadata(MetadataKeys.DEPENDENCY_CONFIG, dependency);

    if (dependencyKey in this.dependencies) {
      return this.returnDependency<T>(dependencyKey, dependencyConfig);
    }

    if (dependencyConfig.injectMode === "global") {
      this.dependencies[dependencyKey] = this.createInstance(dependency);
    }
    else {
      this.dependencies[dependencyKey] = dependency;
    }

    return this.returnDependency<T>(dependencyKey, dependencyConfig);
  }

  private returnDependency<T>(dependencyKey: symbol, dependencyConfig: DependencyConfig): T {
    if (dependencyConfig.injectMode === "global") {
      return this.dependencies[dependencyKey] as T;
    }
    else {
      return new this.dependencies[dependencyKey] as T;
    }
  }

  private createInstance(dependency: any) {
    const constructorArguments: any[] = [];

    for (const constructorArgument in dependency.arguments) {
      const dependencyKey = <symbol> Reflect.getMetadata(MetadataKeys.DEPENDENCY_KEY, constructorArgument);

      if (!dependencyKey) {
        constructorArguments.push(constructorArgument);
      }
      else {
        constructorArguments.push(
          this.createInstance(dependency)
        );
      }
    }

    return new dependency(...constructorArguments);
  }
}
