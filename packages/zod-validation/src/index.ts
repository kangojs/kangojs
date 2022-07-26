import {Injectable, RequestValidator, ValidationResult} from "@kangojs/core";
import {Schema} from "zod";


@Injectable({
  identifier: "zod-validator",
  injectMode: "singleton"
})
export class ZodValidator extends RequestValidator {
  async validate(schema: Schema, data: any): Promise<boolean | ValidationResult> {
    const result = schema.safeParse(data);

    if (result.success) {
      return {
        valid: true
      };
    }
    else {
      const formattedError = result.error.format();

      return {
        valid: false,
        failReason: formattedError
      };
    }
  }
}
