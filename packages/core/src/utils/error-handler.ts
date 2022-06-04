import { Response } from "express";
import {ErrorResponseManager, ResponseManagerConfig} from "./error-response-manager";
import { BaseError } from "../errors/base.error";
import {Injectable} from "../decorators/injectable.decorator";
import {Logger} from "./logger";

/**
 * Config for the error handler.
 */
export interface ErrorHandlerConfig {
  catchUnhandledRejection?: boolean,
  catchUncaughtException?: boolean,
  safeErrors?: string[],
  responseManagerConfig?: ResponseManagerConfig
}

/**
 * The class responsible for all error handling, including HTTP responses if required.
 */
@Injectable({
  injectMode: "singleton",
  identifier: "ErrorHandler"
})
export class ErrorHandler {
  private readonly _safeErrors: string[] = [
    "UserError",
    "AccessError",
    "AccessDeniedError",
    "AccessForbiddenError",
    "ResourceError",
    "ResourceNotFoundError",
    "ResourceNotUniqueError",
    "ResourceRelationshipError"
  ];

  constructor(
    private logger: Logger,
    private errorResponseManager: ErrorResponseManager,
    private errorHandlerConfig?: ErrorHandlerConfig
  ) {
    if (errorHandlerConfig?.safeErrors) {
      this._safeErrors = this._safeErrors.concat(errorHandlerConfig.safeErrors);
    }

    if (errorHandlerConfig?.catchUncaughtException !== false) {
      this.setupUncaughtExceptionListener();
    }
    if (errorHandlerConfig?.catchUnhandledRejection !== false) {
      ErrorHandler.setupUnhandledRejectionListener();
    }
  }

  private static setupUnhandledRejectionListener() {
    process.on("unhandledRejection", (reason: string, p: Promise<any>) => {
      throw reason;
    });
  }

  private setupUncaughtExceptionListener() {
    process.on("uncaughtException", async (error: Error) => {
      await this.handleError(error);
      await this._handleUnexpectedError();
    });
  }

  /**
   * The central method used to handle all errors.
   * @param error
   * @param res
   */
  async handleError(error: Error, res?: Response) {
    const isSafeError = this.isSafeError(error);

    // Log the error if it isn't safe.
    if (!isSafeError) {
      this.logger.error({
        message: error.message || "Unhandled and unsafe error occurred",
        context: error
      });
    }

    // If the error doesn't extend BaseError then assume it's unexpected.
    if (!(error instanceof BaseError)) {
      return this._handleUnexpectedError();
    }

    // If the handler is being used within Express then create a response.
    if (res) {
      return this.errorResponseManager.sendErrorResponse(error, res);
    }

    // If the handler is being used outside Express, treat all errors as
    // unexpected unless safe.
    if (!isSafeError) {
      return this._handleUnexpectedError();
    }
  }

  /**
   * Handle an unexpected error that shouldn't have occurred.
   */
  async _handleUnexpectedError() {
    // If an error wasn't expected force the process to exit to
    // try and stop any unexpected side effects from occurring.
    process.exit(1);
  }

  /**
   * Determine if the given error can be considered safe.
   * @param err
   */
  isSafeError(err: Error): boolean {
    return this._safeErrors.includes(err.constructor.name);
  }
}
