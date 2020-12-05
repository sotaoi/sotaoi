import type { InputValidatorInterface } from '@sotaoi/omni/definitions/input-validator-interface';
import { BaseInput, FieldValidation, CollectionInput, FormValidations } from '@sotaoi/omni/input';
import { QueryBuilder, ErrorResult } from '@sotaoi/omni/transactions';

type RequesterFn = (key: string, validations: FieldValidation[], args: { [key: string]: any }) => Promise<string[]>;

interface InputValidatorConfig {
  getInput?: (key: string) => void | null | BaseInput<any, any>;
  t?: (key: string, ...args: any[]) => string;
  messages?: { [key: string]: { [key: string]: string } };
  defaultErrorMsg?: string;
}

interface InputValidationResult {
  valid: boolean;
  title: string;
  message: string;
  validations: { [key: string]: string[] };
}

abstract class InputValidator<FormValidation = null>
  implements InputValidatorInterface<InputValidationResult, FieldValidation, CollectionInput> {
  abstract getResult(): InputValidationResult;
  abstract setErrorResult(errorResult: ErrorResult): void;
  abstract getErrors(key: string): string[];
  abstract getApiErrors(key: string): string[];
  abstract getAllApiErrors(): { [key: string]: string[] };
  abstract async validate(key: string, validations: FieldValidation[]): Promise<string[]>;
  abstract async validateCollection(collectionInput: CollectionInput): Promise<void>;
  abstract async validatePayload(
    payload: { [key: string]: any },
    form: FormValidations,
    tlPrefix: string,
    isUpdateCommand: boolean,
  ): Promise<void>;

  abstract getFormValidation(
    getInput: (key: string) => void | null | BaseInput<any, any>,
  ): InputValidator<(key: string) => void | null | BaseInput<any, any>>;

  public static DEFALUT_ERROR_MSG = 'Field validation failed for method "%s"';

  protected config: InputValidatorConfig;
  protected db: null | ((repository: string) => QueryBuilder);
  protected requester: null | RequesterFn;
  protected formValidation: null | FormValidation;
  protected errorTitle: null | string;
  protected errorMsg: null | string;
  protected errorMessages: { [key: string]: string[] };
  protected apiErrorMessages: { [key: string]: string[] };

  constructor(
    config: InputValidatorConfig,
    db: null | ((repository: string) => QueryBuilder),
    requester: null | RequesterFn,
  ) {
    if ((!db && !requester) || (!!db && !!requester)) {
      throw new Error('failed to initialize input validator');
    }
    this.config = config;
    this.db = db;
    this.requester = requester;
    this.formValidation = null;
    this.errorTitle = null;
    this.errorMsg = null;
    this.errorMessages = {};
    this.apiErrorMessages = {};
  }

  public isValid(): boolean {
    for (const errorMessages of Object.values(this.errorMessages)) {
      if (!errorMessages.length) {
        continue;
      }
      return false;
    }
    return true;
  }
}

export { InputValidator };
export type { RequesterFn, InputValidatorConfig, InputValidationResult };
