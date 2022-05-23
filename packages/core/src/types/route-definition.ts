import { HTTPMethods } from "../utils/http-methods";

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
  handleResponse?: boolean;
}
