import { Response } from 'express';
import {
  ErrorHttpMappings,
  defaultErrorHTTPMapping,
  defaultFallbackMapping, ErrorHttpMapping
} from './error-http-mappings';
import { BaseError } from '../errors/base.error';


export interface ResponseManagerConfig {
  errorHttpMapping?: ErrorHttpMappings,
  fallbackErrorMapping?: ErrorHttpMapping
}


export class ResponseManager {
  private readonly errorHttpMapping: ErrorHttpMappings = defaultErrorHTTPMapping;
  private readonly fallbackErrorMapping: ErrorHttpMapping = defaultFallbackMapping;

  constructor(responseManagerConfig?: ResponseManagerConfig) {
    if (responseManagerConfig?.errorHttpMapping) {
      this.errorHttpMapping = {
        ...this.errorHttpMapping,
        ...responseManagerConfig.errorHttpMapping
      }
    }

    if (responseManagerConfig?.fallbackErrorMapping) {
      this.fallbackErrorMapping = responseManagerConfig.fallbackErrorMapping;
    }
  }

  async sendErrorResponse(err: Error, res: Response) {
    const errorName = err.constructor.name;
    const httpCode = this.errorHttpMapping[errorName].httpCode || defaultFallbackMapping.httpCode;
    let message = defaultFallbackMapping.defaultMessage;

    if (err instanceof BaseError) {
      if (err.applicationMessage) {
        message = err.applicationMessage;
      }
      else if (this.errorHttpMapping[errorName].defaultMessage) {
        message = this.errorHttpMapping[errorName].defaultMessage;
      }
    }

    return res.status(httpCode).send({
      statusCode: httpCode,
      message: message
    })
  }
}
