import { plainToInstance, TransformOptions } from "class-transformer";
import { validate, ValidatorOptions } from "class-validator";
import {RequestValidator, ValidationResult} from "@kangojs/core";
import {ClassValidatorOptions} from "./types/class-validator-options";
import {defaultClassTransformerOptions, defaultClassValidatorOptions} from "./types/default-options";
import {classValidatorErrorPrettier} from "./utils/class-validator-error-prettier";


export class ClassValidator extends RequestValidator {
  private readonly classTransformerOptions: TransformOptions;
  private readonly classValidatorOptions: ValidatorOptions;

  constructor(options?: ClassValidatorOptions) {
    super();

    this.classTransformerOptions = options?.classTransformerOptions || defaultClassTransformerOptions;
    this.classValidatorOptions = options?.classValidatorOptions || defaultClassValidatorOptions;
  }

  async validate(dtoClass: any, data: any): Promise<boolean | ValidationResult> {
    const dto = plainToInstance(
      dtoClass,
      data,
      this.classTransformerOptions
    );

    const errors = await validate(dto, this.classValidatorOptions);

    if (errors.length > 0) {
      return {
        valid: false,
        failReason: classValidatorErrorPrettier(errors)
      };
    }

    return {
      valid: true
    };
  }
}
