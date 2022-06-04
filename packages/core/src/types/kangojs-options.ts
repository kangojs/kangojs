import { Instantiable } from "../utils/dependency-container";
import { MiddlewareFactory, MiddlewareFunction, RequestValidator } from "./middleware/middleware-interface";
import {CommonMiddlewareOptions} from "./middleware/common-middleware-options";
import {RouteNotFoundOptions} from "./middleware/route-not-found-options";

/**
 * Options that can be passed to KangoJS when it's instantiated.
 */
export interface KangoJSOptions {
  controllers: Instantiable<any>[],
  middleware?: ( MiddlewareFunction | Instantiable<MiddlewareFactory> )[];
  globalPrefix?: string;
  authValidator?: Instantiable<MiddlewareFactory>;
  bodyValidator?: Instantiable<RequestValidator>;
  queryValidator?: Instantiable<RequestValidator>;
  paramsValidator?: Instantiable<RequestValidator>;
  commonMiddlewareOptions?: CommonMiddlewareOptions;
  routeNotFoundOptions?: RouteNotFoundOptions;
}
