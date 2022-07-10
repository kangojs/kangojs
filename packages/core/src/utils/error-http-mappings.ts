import {HTTPStatusCodes} from "../enums/http-status-codes";
import {
  ACCESS_DENIED, ACCESS_FORBIDDEN,
  RESOURCE_NOT_FOUND,
  RESOURCE_NOT_UNIQUE, RESOURCE_RELATIONSHIP_INVALID,
  SYSTEM_UNEXPECTED,
  USER_REQUEST_INVALID
} from "../errors/error-identifiers";

export interface ErrorHttpMapping {
  identifier: string,
  httpCode: HTTPStatusCodes,
  defaultMessage: string
}

export interface ErrorHttpMappings {
  [x: string]: ErrorHttpMapping
}

export const defaultFallbackMapping: ErrorHttpMapping = {
  identifier: SYSTEM_UNEXPECTED,
  httpCode: HTTPStatusCodes.INTERNAL_SERVER_ERROR,
  defaultMessage: "An unexpected error occurred while processing your request. Please try again later."
};

export const defaultErrorHTTPMapping: ErrorHttpMappings = {
  "UserError": {
    identifier: USER_REQUEST_INVALID,
    httpCode: HTTPStatusCodes.BAD_REQUEST,
    defaultMessage: "Your request was invalid."
  },
  "ResourceNotFoundError": {
    identifier: RESOURCE_NOT_FOUND,
    httpCode: HTTPStatusCodes.NOT_FOUND,
    defaultMessage: "The requested resource could not be found."
  },
  "ResourceNotUniqueError": {
    identifier: RESOURCE_NOT_UNIQUE,
    httpCode: HTTPStatusCodes.BAD_REQUEST,
    defaultMessage: "Your request would make a resource that is not unique."
  },
  "ResourceRelationshipError": {
    identifier: RESOURCE_RELATIONSHIP_INVALID,
    httpCode: HTTPStatusCodes.BAD_REQUEST,
    defaultMessage: "Your request includes an invalid relationship to another resource."
  },
  "AccessDeniedError": {
    identifier: ACCESS_DENIED,
    httpCode: HTTPStatusCodes.UNAUTHORIZED,
    defaultMessage: "Your are not authorized to access the given resource."
  },
  "AccessForbiddenError": {
    identifier: ACCESS_FORBIDDEN,
    httpCode: HTTPStatusCodes.FORBIDDEN,
    defaultMessage: "Your are forbidden from accessing the given resource."
  }
};
