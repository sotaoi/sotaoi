import { ErrorResult } from '@sotaoi/omni/transactions';
import { FormValidations } from '@sotaoi/omni/input';

interface InputValidatorInterface<InputValidationResult, FieldValidation, CollectionInput> {
  getResult(): InputValidationResult;
  setErrorResult(errorResult: ErrorResult): void;
  getErrors(key: string): string[];
  getApiErrors(key: string): string[];
  getAllApiErrors(key: string): { [key: string]: string[] };
  validate(key: string, validations: FieldValidation[]): Promise<string[]>;
  validateCollection(collectionInput: CollectionInput): Promise<void>;
  validatePayload(
    payload: { [key: string]: any },
    form: FormValidations,
    tlPrefix: string,
    isUpdateCommand: boolean,
  ): Promise<void>;
}

export type { InputValidatorInterface };
