import { BaseInput } from '@sotaoi/omni/input';
import { BaseField } from '@sotaoi/client/forms';

class BooleanInput extends BaseInput<boolean, boolean> {
  public value: boolean;
  constructor(value: boolean) {
    super(value);
    this.value = value;
  }

  public input(field: typeof BaseField): { input: BooleanInput; field: typeof BaseField } {
    return {
      input: this,
      field,
    };
  }

  public getValue(): boolean {
    return this.value;
  }

  public isEmpty(): boolean {
    return !this.value;
  }

  public serialize(forStorage: boolean): any {
    if (forStorage) {
      return !!this.value;
    }
    return JSON.stringify({ bi: this.value });
  }

  public convert(value: boolean | BooleanInput): BooleanInput {
    return BooleanInput.convert(value);
  }

  public deserializeCondition(fieldPayload: any, payloadJson: { [key: string]: any }): boolean {
    return typeof payloadJson.bi !== 'undefined';
  }
  public deserialize(value: string): BooleanInput {
    const parsed = JSON.parse(value);
    if (typeof parsed.bi !== 'boolean') {
      throw new Error('failed to parse options select input');
    }
    return new BooleanInput(parsed.bi);
  }

  public static convert(value: boolean | number | string | BooleanInput): BooleanInput {
    if (value instanceof BooleanInput) {
      return value;
    }
    if (typeof value === 'boolean') {
      return new BooleanInput(value);
    }
    if (typeof value === 'string' || typeof value === 'number') {
      return new BooleanInput(!!value);
    }
    throw new Error('failed to parse options select input');
  }
}

export { BooleanInput };
