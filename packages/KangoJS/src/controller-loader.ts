/**
 * Load all module controllers and setup the connection between
 * ExpressJS routing and the correct controller.
 *
 * Use of routing decorators based on https://nehalist.io/routing-with-typescript-decorators/#registeringroutes.
 */

import "reflect-metadata";

import { Application, Router, Request, Response, NextFunction } from 'express';
import glob from "glob-promise";

import { HTTPMethods } from './utils/http-methods';
import { RouteMetadata } from "./types/route-metadata";
import {
	ControllerLoaderConfig,
	ControllerLoaderConstructorOptions
} from './types/controller-loader-config';


class ControllerLoader {
	private readonly router: Router;
	private authFunction?: (req: Request, res: Response, next: NextFunction) => Promise<any>;
	private validateBody?: (bodyShape: any) => (req: Request, res: Response, next: NextFunction) => Promise<any>;
	private validateQuery?: (queryShape: any) => (req: Request, res: Response, next: NextFunction) => Promise<any>;
	private config: ControllerLoaderConfig;

	constructor(config: ControllerLoaderConstructorOptions) {
		this.router = Router();

		this.config = {
			controllerFilesGlob: config.controllerFilesGlob,
			globalPrefix: config.globalPrefix ? config.globalPrefix : null,
		}

		if (config.authFunction) {
			this.authFunction = config.authFunction;
		}
		if (config.validateBody) {
			this.validateBody = config.validateBody;
		}
		if (config.validateQuery) {
			this.validateQuery = config.validateQuery;
		}
	}

	async boostrap(app: Application) {
		const controllerFiles = await glob(
			this.config.controllerFilesGlob,
			{absolute: true} // Make file paths absolute so imports don't fail when used in a project.
		);

		for (let index = 0; index < controllerFiles.length; index++) {
			let controller = await import(controllerFiles[index])
			await this.registerController(controller.default);
		}

		if (this.config.globalPrefix) {
			app.use(this.config.globalPrefix, this.router);
		}
		else {
			app.use(this.router);
		}
	}

	async registerController(controller: any) {
		// todo: instance should be registered to a DI system?
		const controllerInstance = new controller();

		// Setup controller routes.
		const controllerGlobalRoute = <string> Reflect.getMetadata('route', controller);
		const controllerRoutes = <Array<RouteMetadata>> Reflect.getMetadata('routes', controller);

		for (const route of controllerRoutes) {
			// Setting route path
			let routePath = controllerGlobalRoute.startsWith("/")
				? controllerGlobalRoute
				: `/${controllerGlobalRoute}`;

			if (route.routeDefinition.path) {
				if (!routePath.endsWith('/')) {
					routePath += '/';
				}

				routePath += route.routeDefinition.path.replace('/', '');
			}

			let routeMiddleware = [];

			if (route.routeDefinition.bodyShape) {
				if (this.validateBody) {
					routeMiddleware.push(
						this.validateBody(route.routeDefinition.bodyShape)
					)
				}
				else {
					throw new Error(`No validateBody function registered but validation is required by ${routePath}`);
				}
			}

			if (route.routeDefinition.queryShape) {
				if (this.validateQuery) {
					routeMiddleware.push(
						this.validateQuery(route.routeDefinition.queryShape)
					)
				}
				else {
					throw new Error(`No validateQuery function registered but validation is required by ${routePath}`);
				}
			}

			// Assume the route should be protected if it's not specified.
			// This ensures no route is accidentally left unprotected.
			if (route.routeDefinition.protected || route.routeDefinition.protected === undefined) {
				const self = this;
				routeMiddleware.push(
					function authorizationMiddleware(req: Request, res: Response, next: NextFunction) {
						if (self.authFunction) {
							return self.authFunction(req, res, next);
						}

						throw new Error(`No authFunction registered but ${req.path} is marked as protected.`);
					}
				)
			}

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

export { ControllerLoader };
