import "reflect-metadata";

import { Application, Router } from "express";
import glob from "glob-promise";

import { KangoJSOptions, MiddlewareFunction, ValidatorFunction } from "./types/kangojs-options";
import { MetadataKeys } from "./decorators/metadata-keys";
import { HTTPMethods } from "./utils/http-methods";
import { RouteMetadata } from "./types/route-metadata";
import { DependencyContainer } from "./utils/dependency-container";

/**
 * The main object that encapsulates and manages all framework features.
 */
export class KangoJS {
  private readonly app: Application;
  private readonly router: Router;
  readonly dependencyContainer: DependencyContainer;
  private readonly controllerFilesGlob: string;
  private readonly globalPrefix?: string;
  private readonly authValidator?: MiddlewareFunction;
  private readonly bodyValidator?: ValidatorFunction;
  private readonly queryValidator?: ValidatorFunction;
  private readonly paramsValidator?: ValidatorFunction;

  /**
   * The object constructor.
   *
   * @param app - An Express application
   * @param options - options for customising how KangoJS works.
   */
  constructor(app: Application, options: KangoJSOptions) {
    this.app = app;
    this.router = Router();

    // Setup dependency container
    // no dependencies are added till .bootstrap to allow for overwrites of the Express router/app etc
    this.dependencyContainer = new DependencyContainer();

    // Setup configuration
    this.controllerFilesGlob = options.controllerFilesGlob;
    this.globalPrefix = options.globalPrefix || undefined;

    // Setup global helper functions
    this.authValidator = options.authValidator || undefined;
    this.bodyValidator = options.bodyValidator || undefined;
    this.queryValidator = options.queryValidator || undefined;
    this.paramsValidator = options.paramsValidator || undefined;
  }

  getApp(): Application {
    return this.app;
  }

  getRouter(): Router {
    return this.router;
  }

  /**
	 * The main method that bootstraps KangoJS, loading all controllers etc.
	 *
	 * @param app - The Express app instance to add routes to.
	 */
  async boostrap() {
    const controllers = await KangoJS._getControllersFromFiles(this.controllerFilesGlob);

    for (const controller of controllers) {
      await this.processController(controller);
    }

    if (this.globalPrefix) {
      this.app.use(this.globalPrefix, this.router);
    }
    else {
      this.app.use(this.router);
    }
  }

  /**
	 * Search and import controller classes from source files.
	 *
	 * @param fileGlob - The glob used to search for controller files.
	 * @private
	 */
  private static async _getControllersFromFiles(fileGlob: string): Promise<object[]> {
    const controllerFiles = await glob(
      fileGlob,
      {absolute: true} // Make file paths absolute to ensure imports don't fail when used in a project.
    );

    const controllers = [];
    for (let index = 0; index < controllerFiles.length; index++) {
      const controller = await import(controllerFiles[index]);

      if (controller.default) {
        controllers.push(controller.default);
      }
    }

    return controllers;
  }

  /**
	 * Process a given controller class.
	 * This primarily consists of setting up routing to the route methods.
	 *
	 * @param controller - A controller class
	 * @private
	 */
  private async processController(controller: any) {
    const controllerInstance = this.dependencyContainer.useDependency<typeof controller>(controller);

    // Setup controller routes.
    const controllerGlobalRoute = <string> Reflect.getMetadata(MetadataKeys.ROUTE_PREFIX, controller);
    const controllerRoutes = <Array<RouteMetadata>> Reflect.getMetadata(MetadataKeys.ROUTES, controller);

    for (const route of controllerRoutes) {
      // Set route path, making sure to handle if the path has '/' or not.
      let routePath = controllerGlobalRoute.startsWith("/")
        ? controllerGlobalRoute
        : `/${controllerGlobalRoute}`;

      if (route.routeDefinition.path) {
        if (!routePath.endsWith("/") && !route.routeDefinition.path.startsWith("/")) {
          routePath += "/";
        }
        routePath += route.routeDefinition.path;
      }

      const routeMiddleware = [];

      // Routes must explicitly set authRequired=false to disable route protection.
      // This ensures no route is accidentally left unprotected.
      if (route.routeDefinition.authRequired !== false) {
        if (this.authValidator) {
          routeMiddleware.push(this.authValidator);
        }
        else {
          throw new Error(`No authValidator registered but ${routePath} requires it.`);
        }
      }

      if (route.routeDefinition.bodyShape) {
        if (this.bodyValidator) {
          routeMiddleware.push(
            this.bodyValidator(route.routeDefinition.bodyShape)
          );
        }
        else {
          throw new Error(`No bodyValidator function registered but validation is required by ${routePath}`);
        }
      }

      if (route.routeDefinition.queryShape) {
        if (this.queryValidator) {
          routeMiddleware.push(
            this.queryValidator(route.routeDefinition.queryShape)
          );
        }
        else {
          throw new Error(`No queryValidator function registered but validation is required by ${routePath}`);
        }
      }

      if (route.routeDefinition.paramsShape) {
        if (this.paramsValidator) {
          routeMiddleware.push(
            this.paramsValidator(route.routeDefinition.paramsShape)
          );
        }
        else {
          throw new Error(`No paramsValidator function registered but validation is required by ${routePath}`);
        }
      }

      // Bind the controller instance to ensure the method works as expected.
      routeMiddleware.push(controllerInstance[route.methodName].bind(controllerInstance));

      switch (route.routeDefinition.httpMethod) {
      case HTTPMethods.GET: {
        this.router.get(routePath, ...routeMiddleware);
        break;
      }
      case HTTPMethods.POST: {
        this.router.post(routePath, ...routeMiddleware);
        break;
      }
      case HTTPMethods.PATCH: {
        this.router.patch(routePath, ...routeMiddleware);
        break;
      }
      case HTTPMethods.PUT: {
        this.router.put(routePath, ...routeMiddleware);
        break;
      }
      case HTTPMethods.DELETE: {
        this.router.delete(routePath, ...routeMiddleware);
        break;
      }
      }
    }
  }
}
