import { HTTPMethods } from '../utils/http-methods';

interface RouteDefinition {
  path?: string;
  httpMethod: HTTPMethods;
  protected?: boolean;
  bodyShape?: any;
  queryShape?: any;
}

export { RouteDefinition }
