import type { QueryBuilder, ErrorResult } from '@sotaoi/omni/transactions';
import { InputValidator, RequesterFn, InputValidatorConfig, InputValidationResult } from '@sotaoi/client/contracts';
import {
  StringInput,
  FileInput,
  RefSelectInput,
  BaseInput,
  CollectionInput,
  FormValidations,
  FieldValidation,
} from '@sotaoi/omni/input';
import { Helper } from '@sotaoi/omni/helper';
import _ from 'lodash';
import { BaseField } from '@sotaoi/client/forms/fields/base-field';
import fs from 'fs';

class InputValidatorOmni extends InputValidator {
  protected t: (key: string, ...args: any[]) => string;
  protected messages: { [key: string]: { [key: string]: string } };

  constructor(
    config: InputValidatorConfig,
    db: null | ((repository: string) => QueryBuilder),
    requester: null | RequesterFn,
  ) {
    config.t = config.t || ((key: string, ...args: any[]): string => key);
    config.messages = {
      generic: {
        invalid: 'Field is invalid',
      },
      required: {
        isRequired: 'This field is required',
      },
      email: {
        format: 'This does not look like an email address',
      },
      ref: {
        isNot: 'Selected value is invalid',
      },
      ...config.messages,
    };
    super(config, db, requester);
    this.t = config.t;
    this.messages = config.messages;
  }

  public getFormValidation(getInput: (key: string) => void | null | BaseInput<any, any>): InputValidatorOmni {
    return new InputValidatorOmni(
      {
        ...this.config,
        getInput,
      },
      this.db,
      this.requester,
    );
  }

  public getResult(): InputValidationResult {
    const valid = this.isValid();
    return {
      valid,
      title: valid ? 'Success' : 'Warning',
      message: valid ? 'Form validation succeeded' : 'Form validation failed',
      validations: this.errorMessages,
    };
  }

  public getErrors(key: string): string[] {
    return this.errorMessages[key] || [];
  }

  public getApiErrors(key: string): string[] {
    return this.apiErrorMessages[key] || [];
  }

  public getAllApiErrors(): { [key: string]: string[] } {
    return this.apiErrorMessages || {};
  }

  public async validate(key: string, validations: FieldValidation[]): Promise<string[]> {
    this.errorMessages[key] = [];
    this.apiErrorMessages[key] = [];
    if (!this.config.getInput) {
      throw new Error('form validation is not initialized');
    }
    if (typeof key !== 'string' || !key || !(validations instanceof Array)) {
      throw new Error('bad input for form validation function');
    }
    await validations.map(async (validation) => {
      if (typeof (this as { [key: string]: any })[validation.method] !== 'function') {
        this.errorMessages[key].push(this.t(InputValidatorOmni.DEFALUT_ERROR_MSG.replace('%s', validation.method)));
        return;
      }
      const result = await (this as { [key: string]: any })[validation.method](key, validation.args);
      if (!result) {
        return;
      }
      this.errorMessages[key].push(result);
    });
    return [...this.errorMessages[key]];
  }

  public async validateCollection(collectionInput: CollectionInput): Promise<void> {
    if (!this.config.getInput) {
      throw new Error('form validation is not initialized');
    }
    if (!(collectionInput instanceof CollectionInput)) {
      throw new Error('bad input for form collection validation function');
    }
    if (
      collectionInput.value.fields.length >= collectionInput.value.min &&
      collectionInput.value.fields.length <= collectionInput.value.max
    ) {
      return;
    }
    throw new Error('collection count failed');
  }

  public async validatePayload(
    payload: { [key: string]: any },
    form: FormValidations,
    tlPrefix: string,
    isUpdateCommand: boolean,
  ): Promise<void> {
    await Helper.iterateAsync(Helper.clone(form), tlPrefix, async (item, prefix, transformer, prop) => {
      prefix = prefix ? `${prefix}.` : '';
      const key = prefix + prop;
      let nextKey: string;

      const inputPayload = _.get(payload, key);
      if (isUpdateCommand && inputPayload && inputPayload.type === 'undefined') {
        return inputPayload;
      }

      if (!(item instanceof Array)) {
        const collectionPayload = inputPayload;
        const collectionValidations = item.fields;
        switch (true) {
          // multi collection
          case collectionPayload.fields instanceof Array && collectionPayload.type === 'collection':
            await this.validateCollection(CollectionInput.deserialize(collectionPayload));
            await collectionPayload.fields.map(async (field: any, index: number) => {
              nextKey = `${key}.fields.${index.toString()}`;
              await this.validatePayload(payload, collectionValidations, nextKey, isUpdateCommand);
            });
            return item;
          // single collection
          case typeof collectionPayload.fields === 'object' &&
            !(collectionPayload.fields instanceof Array) &&
            collectionPayload.type === 'singleCollection':
            nextKey = `${key}.fields`;
            await this.validatePayload(payload, collectionValidations, nextKey, isUpdateCommand);
            return item;
          default:
            throw new Error('something went wrong trying to validate the form');
        }
      }

      await this.validate(key, item);
      if (inputPayload instanceof BaseField) {
        inputPayload.setTouched(true);
      }

      return item;
    });
  }

  public setErrorResult(errorResult: ErrorResult): void {
    this.apiErrorMessages = errorResult.validations || {};
    this.errorTitle = errorResult.title;
    this.errorMsg = errorResult.msg;
  }

  protected getInput(key: string): BaseInput<any, any> {
    if (!this.config.getInput) {
      throw new Error('form validation is not initialized');
    }
    const input = this.config.getInput(key);
    if (!input) {
      throw new Error('input validator failed to get input');
    }
    return input;
  }

  protected async required(key: string): Promise<void | string> {
    const input = this.getInput(key);
    if (input && !input.isEmpty()) {
      return;
    }
    return this.t(this.messages.required.isRequired || InputValidatorOmni.DEFALUT_ERROR_MSG.replace('%s', 'required'));
  }

  protected async email(key: string): Promise<void | string> {
    const input = this.getInput(key);
    if (typeof input === 'undefined') {
      return;
    }
    const re = /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    if (!(input instanceof StringInput) || !re.test(input.value)) {
      return this.t(this.messages.email.format);
    }
  }

  protected async ref(key: string): Promise<void | string> {
    const input = this.getInput(key);
    if (typeof input === 'undefined' || input instanceof RefSelectInput) {
      return;
    }
    return this.t(this.messages.ref.isNot);
  }

  protected async min(key: string, args: { [key: string]: any } = {}): Promise<void | string> {
    const input = this.getInput(key);
    if (typeof input === 'undefined') {
      return;
    }
    if (!(input instanceof StringInput) || typeof args !== 'object' || typeof args.length !== 'number') {
      return this.t(this.messages.generic.invalid);
    }
    if ((input as StringInput).value.length < args.length) {
      return this.t(this.messages.generic.invalid);
    }
  }

  protected async street(key: string, args: { [key: string]: any } = {}): Promise<void | string> {
    //
  }

  protected async title(key: string, args: { [key: string]: any } = {}): Promise<void | string> {
    //
  }

  protected async content(key: string, args: { [key: string]: any } = {}): Promise<void | string> {
    //
  }

  protected async file(key: string, args: { [key: string]: any } = {}): Promise<void | string> {
    const input = this.getInput(key);
    if (input.isEmpty()) {
      return;
    }
    if (!(input instanceof FileInput)) {
      return this.t(this.messages.generic.invalid);
    }

    // client (if file input has file, then execution is on the client side)
    if (input.getValue().file) {
      const file = input.getValue().file as File;
      if (typeof args.maxSize !== 'undefined' && file.size > args.maxSize) {
        // too large
        return this.t(this.messages.generic.invalid);
      }
      return;
    }

    // api (if file input has path, then it is an upload and execution is on the API side)
    if (input.getValue().path) {
      const file = fs.lstatSync(input.getValue().path);
      if (typeof args.maxSize !== 'undefined' && file.size > args.maxSize) {
        // too large
        return this.t(this.messages.generic.invalid);
      }
    }

    // if file input has neither file, nor path, then it's value is unchanged, or is a delete request
    // in which case we do nothing
  }
}

export { InputValidatorOmni };
