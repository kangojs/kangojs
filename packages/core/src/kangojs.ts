import "reflect-metadata";

import express, {Application, NextFunction, Request, Response, Router} from "express";

import { KangoJSOptions } from "./types/kangojs-options";
import { MetadataKeys } from "./decorators/metadata-keys";
import { HTTPMethods } from "./utils/http-methods";
import { RouteMetadata } from "./types/route-metadata";
import { DependencyContainer, Instantiable } from "./utils/dependency-container";
import {MiddlewareFactory, MiddlewareFunction, RequestValidator, ValidatorFunction} from "./types/middleware-interface";
import {HTTPStatusCodes} from "@kangojs/http-status-codes";

/**
 * The main object that encapsulates and manages all framework features.
 */
export class KangoJS {
  private readonly app: Application;
  private readonly router: Router;
  readonly dependencyContainer: DependencyContainer;
  private readonly globalPrefix?: string;
  private readonly authValidator?: Instantiable<MiddlewareFactory>;
  private readonly bodyValidator?: Instantiable<RequestValidator>;
  private readonly queryValidator?: Instantiable<RequestValidator>;
  private readonly paramsValidator?: Instantiable<RequestValidator>;

  /**
   * The object constructor.
   *
   * @param options - options for customising how KangoJS works.
   */
  constructor(options: KangoJSOptions) {
    this.app = express();
    this.router = Router();

    // Setup dependency container
    this.dependencyContainer = new DependencyContainer();

    // Setup configuration
    this.globalPrefix = options.globalPrefix || undefined;

    // Setup global helper functions
    this.authValidator = options.authValidator || undefined;
    this.bodyValidator = options.bodyValidator || undefined;
    this.queryValidator = options.queryValidator || undefined;
    this.paramsValidator = options.paramsValidator || undefined;

    for (const controller of options.controllers) {
      this.processController(controller);
    }

    if (this.globalPrefix) {
      this.app.use(this.globalPrefix, this.router);
    }
    else {
      this.app.use(this.router);
    }
  }

  getApp(): Application {
    return this.app;
  }

  getRouter(): Router {
    return this.router;
  }

  /**
	 * Process a given controller class.
	 * This primarily consists of setting up routing to the route methods.
	 *
	 * @param controller - A controller class
	 * @private
	 */
  private processController(controller: any) {
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

      const routeMiddleware: MiddlewareFunction[] = [];

      // Routes must explicitly set authRequired=false to disable route protection.
      // This ensures no route is accidentally left unprotected.
      if (route.routeDefinition.authRequired !== false) {
        if (this.authValidator) {
          const authValidator = this.dependencyContainer.useDependency(this.authValidator);
          const validatorFunction = authValidator.run.bind(authValidator);
          routeMiddleware.push(validatorFunction);
        }
        else {
          throw new Error(`No auth validator registered but ${routePath} requires it.`);
        }
      }

      if (route.routeDefinition.bodyShape) {
        if (this.bodyValidator) {
          const bodyValidator = this.dependencyContainer.useDependency(this.bodyValidator);
          const validatorFunction = bodyValidator.validate.bind(bodyValidator);

          routeMiddleware.push(
            this.createValidatorMiddleware(validatorFunction, route.routeDefinition.bodyShape, "body")
          );
        }
        else {
          throw new Error(`No body validator registered but validation is required by ${routePath}`);
        }
      }

      if (route.routeDefinition.queryShape) {
        if (this.queryValidator) {
          const queryValidator = this.dependencyContainer.useDependency(this.queryValidator);
          const validatorFunction = queryValidator.validate.bind(queryValidator);

          routeMiddleware.push(
            this.createValidatorMiddleware(validatorFunction, route.routeDefinition.queryShape, "query")
          );
        }
        else {
          throw new Error(`No query validator function registered but validation is required by ${routePath}`);
        }
      }

      if (route.routeDefinition.paramsShape) {
        if (this.paramsValidator) {
          const paramsValidator = this.dependencyContainer.useDependency(this.paramsValidator);
          const validatorFunction = paramsValidator.validate.bind(paramsValidator);

          routeMiddleware.push(
            this.createValidatorMiddleware(validatorFunction, route.routeDefinition.paramsShape, "params")
          );
        }
        else {
          throw new Error(`No paramsValidator function registered but validation is required by ${routePath}`);
        }
      }

      // Bind the controller instance to ensure internal dependencies work as expected
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

  /**
   * A factory function to return the validation middleware for the given validator function.
   *
   * @param validatorFunction
   * @param validationShape
   * @param dataKey
   */
  createValidatorMiddleware(
    validatorFunction: ValidatorFunction,
    validationShape: any,
    dataKey: "body" | "query" | "params"
  ) {
    return function validatorMiddleware(req: Request, res: Response, next: NextFunction) {
      const result = validatorFunction(validationShape, req[dataKey]);

      if (result === true || (typeof result !== "boolean" && result.valid)) {
        return next();
      }

      return res.status(HTTPStatusCodes.BAD_REQUEST).send({
        statusCode: HTTPStatusCodes.BAD_REQUEST,
        message: "The supplied body data did not pass validation.",
        reason: typeof result === "boolean" ? null : (result.failReason ?? null)
      });
    };
  }
}
