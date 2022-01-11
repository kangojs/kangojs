/**
 * An enum of common HTTP status codes.
 */
export enum HTTPStatusCodes {
    OK = 200,
    CREATED = 201,
    MOVED_PERMANENTLY = 301,
    MOVED_TEMPORARILY = 302,
    BAD_REQUEST = 400,
    UNAUTHORIZED = 401,
    FORBIDDEN = 403,
    NOT_FOUND = 404,
    TOO_MANY_REQUESTS = 429,
    INTERNAL_SERVER_ERROR = 500,
    NOT_IMPLEMENTED = 501,
    SERVICE_UNAVAILABLE = 503
}
