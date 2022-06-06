/* eslint-disable @typescript-eslint/ban-ts-comment */

import { DependencyContainer } from "../src/utils/dependency-container";
import { Injectable } from "../src";

@Injectable({
  injectMode: "singleton",
  identifier: "test-global"
})
// @ts-ignore
class TestSingletonDependency {
  testMethod() {
    return "test method";
  }
}

class ChildTestSingletonDependency extends TestSingletonDependency{}

@Injectable({
  injectMode: "unique",
  identifier: "test-unique"
})
// @ts-ignore
class TestUniqueDependency {
  testMethod() {
    return "test method";
  }
}

@Injectable({
  identifier: "test-global"
})
// @ts-ignore
class TestUnknownDependency {
  testMethod() {
    return "test method";
  }
}


describe("Dependency Container",() => {
  let testDependencyContainer: DependencyContainer;

  // Redeclare and reset the dependency container before each test
  beforeEach(async () => {
    testDependencyContainer = new DependencyContainer();
  });

  it("When using useDependency, an instance of the given dependency should be returned", async () => {
    const dep1 = testDependencyContainer.useDependency<TestSingletonDependency>(TestSingletonDependency);
    expect(dep1).toBeInstanceOf(TestSingletonDependency);
  });

  it("When a singleton dependency is declared, the same instance should always be returned", async () => {
    const dep1 = testDependencyContainer.useDependency<TestSingletonDependency>(TestSingletonDependency);
    const dep2 = testDependencyContainer.useDependency<TestSingletonDependency>(TestSingletonDependency);

    expect(dep1 === dep2).toBeTruthy();
  });

  it("When a unique dependency is declared, a different instance should always be returned", async () => {
    const dep1 = testDependencyContainer.useDependency<TestUniqueDependency>(TestUniqueDependency);
    const dep2 = testDependencyContainer.useDependency<TestUniqueDependency>(TestUniqueDependency);

    expect(dep1 === dep2).toBeFalsy();
  });

  it("When a dependency is declared with no explicit injectMode, it should default to singleton", async () => {
    const dep1 = testDependencyContainer.useDependency<TestUnknownDependency>(TestUnknownDependency);
    const dep2 = testDependencyContainer.useDependency<TestUnknownDependency>(TestUnknownDependency);

    expect(dep1 === dep2).toBeTruthy();
  });

  it("When a dependency is overridden, the new dependency override should then be returned", async () => {
    testDependencyContainer.useDependency(TestSingletonDependency);
    testDependencyContainer.overrideDependency(TestSingletonDependency, ChildTestSingletonDependency);
    const dep2 = testDependencyContainer.useDependency<ChildTestSingletonDependency>(TestSingletonDependency);

    expect(dep2).toBeInstanceOf(ChildTestSingletonDependency);
  });
});
