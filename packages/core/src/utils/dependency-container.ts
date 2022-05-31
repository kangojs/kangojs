/* eslint-disable @typescript-eslint/no-explicit-any */

export type GenericClass = any;

export interface DependencyMap {
  [key: symbol]: GenericClass
}

export interface Dependencies {
  [key: symbol]: unknown;
}

export class DependencyContainer {
  private dependencyMap: DependencyMap = {};
  private dependencies: Dependencies = {};

  addDependency(dependency: GenericClass) {
    const key = Symbol.for(dependency.toString());
    this.dependencyMap[key] = dependency;
    console.log("[KangoJS][DI] - Adding dependency " + key.toString());
  }

  getDependency<T>(dependency: GenericClass): T {
    const key = Symbol.for(dependency.toString());

    if (!(key in this.dependencyMap)) {
      throw new Error("Dependency not found");
    }

    if (!(key in this.dependencies)) {
      this.dependencies[key] = this.createInstance(this.dependencyMap[key]);
    }

    return this.dependencies[key] as T;
  }

  createInstance(dependency: new() => any): any {
    return new dependency();
  }
}
