import {HTTPStatusCodes} from "../enums/http-status-codes";
import { ErrorIdentifiers } from "../errors/error-identifiers";


export interface ErrorHttpMapping {
  identifier: string,
  httpCode: HTTPStatusCodes,
  defaultMessage: string
}

export interface ErrorHttpMappings {
  [x: string]: ErrorHttpMapping
}

export const defaultFallbackMapping: ErrorHttpMapping = {
  identifier: ErrorIdentifiers.SYSTEM_UNEXPECTED,
  httpCode: HTTPStatusCodes.INTERNAL_SERVER_ERROR,
  defaultMessage: "An unexpected error occurred while processing your request. Please try again later."
};

export const defaultErrorHTTPMapping: ErrorHttpMappings = {
  "UserError": {
    identifier: ErrorIdentifiers.USER_REQUEST_INVALID,
    httpCode: HTTPStatusCodes.BAD_REQUEST,
    defaultMessage: "Your request was invalid."
  },
  "ResourceNotFoundError": {
    identifier: ErrorIdentifiers.RESOURCE_NOT_FOUND,
    httpCode: HTTPStatusCodes.NOT_FOUND,
    defaultMessage: "The requested resource could not be found."
  },
  "ResourceNotUniqueError": {
    identifier: ErrorIdentifiers.RESOURCE_NOT_UNIQUE,
    httpCode: HTTPStatusCodes.BAD_REQUEST,
    defaultMessage: "Your request would make a resource that is not unique."
  },
  "ResourceRelationshipError": {
    identifier: ErrorIdentifiers.RESOURCE_RELATIONSHIP_INVALID,
    httpCode: HTTPStatusCodes.BAD_REQUEST,
    defaultMessage: "Your request includes an invalid relationship to another resource."
  },
  "AccessUnauthorizedError": {
    identifier: ErrorIdentifiers.ACCESS_UNAUTHORIZED,
    httpCode: HTTPStatusCodes.UNAUTHORIZED,
    defaultMessage: "Your are not authorized to access the given resource."
  },
  "AccessForbiddenError": {
    identifier: ErrorIdentifiers.ACCESS_FORBIDDEN,
    httpCode: HTTPStatusCodes.FORBIDDEN,
    defaultMessage: "Your are forbidden from accessing the given resource."
  }
};
