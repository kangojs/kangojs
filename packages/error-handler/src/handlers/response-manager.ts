import { Response } from 'express';
import {
  ErrorHttpMappings,
  defaultErrorHTTPMapping,
  defaultFallbackMapping, ErrorHttpMapping
} from './error-http-mappings';
import { BaseError } from '../errors/base.error';
import { getAllParentNames } from "../utils/get-all-parent-names";


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
    let httpCode = defaultFallbackMapping.httpCode;
    let message = defaultFallbackMapping.defaultMessage;

    if (err instanceof BaseError) {
      if (err.applicationMessage) {
        message = err.applicationMessage;
      }

      // The HTTP mapping may not contain the error itself, but it may contain any one of its parent errors.
      // Therefore, will must recursively load the prototype chain and check them all.
      const errorChain = getAllParentNames(err);
      for (const errorName of errorChain) {
        if (errorName && Object.keys(this.errorHttpMapping).includes(errorName)) {
          httpCode = this.errorHttpMapping[errorName].httpCode;
          message = err.applicationMessage ? err.applicationMessage : this.errorHttpMapping[errorName].defaultMessage;
          break;
        }
      }
    }

    return res.status(httpCode).send({
      statusCode: httpCode,
      message: message
    })
  }
}
