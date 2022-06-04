import { HTTPMethods } from "../../enums/http-methods";

/**
 * The route definition passed to the @Route decorator.
 */
export interface RouteDefinition {
  path?: string;
  httpMethod: HTTPMethods;
  authRequired?: boolean;
  bodyShape?: any;
  queryShape?: any;
  paramsShape?: any;
}
