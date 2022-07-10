import { Response } from "express";
import {
  ErrorHttpMappings,
  defaultErrorHTTPMapping,
  defaultFallbackMapping, ErrorHttpMapping
} from "./error-http-mappings";
import { BaseError } from "../errors/base.error";
import {Injectable} from "../decorators/injectable.decorator";


export interface ResponseManagerConfig {
  errorHttpMapping?: ErrorHttpMappings,
  fallbackErrorMapping?: ErrorHttpMapping
}

@Injectable({
  identifier: "error-response-manager",
  injectMode: "singleton"
})
export class ErrorResponseManager {
  private readonly errorHttpMapping: ErrorHttpMappings = defaultErrorHTTPMapping;
  private readonly fallbackErrorMapping: ErrorHttpMapping = defaultFallbackMapping;

  constructor(responseManagerConfig?: ResponseManagerConfig) {
    if (responseManagerConfig?.errorHttpMapping) {
      this.errorHttpMapping = {
        ...this.errorHttpMapping,
        ...responseManagerConfig.errorHttpMapping
      };
    }

    if (responseManagerConfig?.fallbackErrorMapping) {
      this.fallbackErrorMapping = responseManagerConfig.fallbackErrorMapping;
    }
  }

  async sendErrorResponse(err: Error, res: Response) {
    const errorName = err.constructor.name;
    const httpCode = this.errorHttpMapping[errorName]?.httpCode || defaultFallbackMapping.httpCode;
    let message = defaultFallbackMapping.defaultMessage;
    let identifier = defaultFallbackMapping.identifier;

    if (err instanceof BaseError) {
      if (err.applicationMessage) {
        message = err.applicationMessage;
      }
      else if (this.errorHttpMapping[errorName]?.defaultMessage) {
        message = this.errorHttpMapping[errorName].defaultMessage;
      }

      if (err.identifier) {
        identifier = err.identifier;
      }
    }

    return res.status(httpCode).send({
      identifier: identifier,
      statusCode: httpCode,
      message: message
    });
  }
}
