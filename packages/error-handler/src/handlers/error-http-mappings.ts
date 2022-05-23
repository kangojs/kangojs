import { HTTPStatusCodes } from "@kangojs/http-status-codes";

export interface ErrorHttpMapping {
  httpCode: HTTPStatusCodes,
  defaultMessage: string
}

export interface ErrorHttpMappings {
  [x: string]: ErrorHttpMapping
}

export const defaultFallbackMapping: ErrorHttpMapping = {
  httpCode: HTTPStatusCodes.INTERNAL_SERVER_ERROR,
  defaultMessage: "An unexpected error occurred while processing your request. Please try again later."
};

export const defaultErrorHTTPMapping: ErrorHttpMappings = {
  "UserError": {
    httpCode: HTTPStatusCodes.BAD_REQUEST,
    defaultMessage: "You request was invalid."
  },
  "ResourceNotFoundError": {
    httpCode: HTTPStatusCodes.NOT_FOUND,
    defaultMessage: "The requested resource could not be found."
  },
  "ResourceNotUniqueError": {
    httpCode: HTTPStatusCodes.BAD_REQUEST,
    defaultMessage: "Your request would make a resource that is not unique."
  },
  "ResourceRelationshipError": {
    httpCode: HTTPStatusCodes.BAD_REQUEST,
    defaultMessage: "Your request includes an invalid relationship to another resource."
  },
  "AccessDeniedError": {
    httpCode: HTTPStatusCodes.UNAUTHORIZED,
    defaultMessage: "Your are not authorized to access the given resource."
  },
  "AccessForbiddenError": {
    httpCode: HTTPStatusCodes.FORBIDDEN,
    defaultMessage: "Your are forbidden from accessing the given resource."
  }
};
