import { Instantiable } from "../utils/dependency-container";
import { MiddlewareFactory, MiddlewareFunction, RequestValidator } from "./middleware-interface";

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
}
