import {LoggerBase, LogEvent, LogLevel} from "../types/logger/logger-interface";
import {Injectable} from "../decorators/injectable.decorator";

@Injectable({
  identifier: "logger",
  injectMode: "singleton"
})
export class Logger extends LoggerBase {
  outputEvent(eventType: LogLevel, event: LogEvent): void {
    const origin = event.origin ? `${event.origin} - ` : null;

    // Always output errors
    if (eventType === "error") {
      console.log(`[${eventType.toUpperCase()}]: ${origin ?? ""}${event.message}`);
      if (event.context) {
        console.log(event.context);
      }
    }
    // On warn output errors and warnings
    else if (this.logLevel === "warn" && ["error", "warn"].includes(eventType)) {
      console.log(`[${eventType.toUpperCase()}]: ${origin ?? ""}${event.message}`);
    }
    // On log output errors, warning & logs
    else if (this.logLevel === "log" && ["error", "warn", "log"].includes(eventType)) {
      console.log(`[${eventType.toUpperCase()}]: ${origin ?? ""}${event.message}`);
    }
    // On verbose, always output the message & also any extra context
    else {
      console.log(`[${eventType.toUpperCase()}]: ${origin ?? ""}${event.message}`);
      if (event.context) {
        console.log(event.context);
      }
    }
  }

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
