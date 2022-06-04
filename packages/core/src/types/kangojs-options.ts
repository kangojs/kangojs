import {Instantiable, StoredDependency} from "../utils/dependency-container";
import {
  MiddlewareFactory,
  MiddlewareFunction,
  MiddlewareList,
  RequestValidator
} from "./middleware/middleware-interface";
import {CommonMiddlewareOptions} from "./middleware/common-middleware-options";
import {RouteNotFoundOptions} from "./middleware/route-not-found-options";
import {ErrorHandlerConfig} from "../utils/error-handler";

export interface DependencyOverride<T> {
  original: Instantiable<T>;
  override: Instantiable<T>
}

/**
 * Options that can be passed to KangoJS when it's instantiated.
 */
export interface KangoJSOptions {
  controllers: Instantiable<any>[],
  middleware?: MiddlewareList;
  dependencyOverrides?: DependencyOverride<any>[];
  globalPrefix?: string;
  authValidator?: Instantiable<MiddlewareFactory>;
  bodyValidator?: Instantiable<RequestValidator>;
  queryValidator?: Instantiable<RequestValidator>;
  paramsValidator?: Instantiable<RequestValidator>;
  commonMiddlewareOptions?: CommonMiddlewareOptions;
  routeNotFoundOptions?: RouteNotFoundOptions;
  errorHandlerConfig?: ErrorHandlerConfig;
}
