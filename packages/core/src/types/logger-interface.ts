/**
 * Log levels represent the importance of the event:
 *
 * - error: something has gone wrong
 * - warn: something isn't right, but it doesn't endanger the application
 * - log: a general log message (DEFAULT LEVEL)
 * - verbose: detailed log messages, most often used for debugging
 */
export type LogLevel = "verbose" | "log" | "warn" | "error";

/**
 * An event to log.
 */
export interface LogEvent {
  message: string,
  origin?: string,
  context?: any
}

/**
 * Configuration to pass to the logger.
 */
export interface LoggerConfig {
  logLevel: LogLevel
}


export abstract class LoggerBase {
  logLevel: LogLevel;

  constructor(config?: LoggerConfig) {
    this.logLevel = config?.logLevel ?? "log";
  }

  abstract outputEvent(logLevel: LogLevel, event: LogEvent): void

  error(event: LogEvent): void {
    this.outputEvent("error", event);
  }

  warn(event: LogEvent): void {
    this.outputEvent("warn", event);
  }

  log(event: LogEvent): void {
    this.outputEvent("log", event);
  }

  verbose(event: LogEvent): void {
    this.outputEvent("verbose", event);
  }
}
