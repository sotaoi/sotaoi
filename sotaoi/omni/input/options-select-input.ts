import { BaseInput } from '@sotaoi/omni/input';
import { BaseField } from '@sotaoi/client/forms';

type OptionsSelectValue = { [key: string]: boolean };
class OptionsSelectInput extends BaseInput<OptionsSelectValue, string> {
  public value: OptionsSelectValue;
  constructor(value: OptionsSelectValue) {
    super(value);
    this.value = value;
  }

  public input(field: typeof BaseField): { input: OptionsSelectInput; field: typeof BaseField } {
    return {
      input: this,
      field,
    };
  }

  public getValue(): OptionsSelectValue {
    return this.value;
  }

  public isEmpty(): boolean {
    return !this.value;
  }

  public serialize(forStorage: boolean): string {
    if (forStorage) {
      return JSON.stringify(this.value);
    }
    return JSON.stringify({ osi: this.value });
  }

  public convert(value: OptionsSelectValue | OptionsSelectInput): OptionsSelectInput {
    return OptionsSelectInput.convert(value);
  }

  public deserializeCondition(fieldPayload: any, payloadJson: { [key: string]: any }): boolean {
    return typeof payloadJson.osi !== 'undefined';
  }
  public deserialize(value: string): OptionsSelectInput {
    const parsed = JSON.parse(value);
    if (typeof parsed.osi !== 'object') {
      throw new Error('failed to parse options select input');
    }
    return new OptionsSelectInput(parsed.osi);
  }

  public static convert(value: string | OptionsSelectValue | OptionsSelectInput): OptionsSelectInput {
    if (value instanceof OptionsSelectInput) {
      return value;
    }
    if (typeof value === 'object') {
      return new OptionsSelectInput(value);
    }
    if (typeof value === 'string') {
      return new OptionsSelectInput(JSON.parse(value));
    }
    throw new Error('failed to parse options select input');
  }
}

export { OptionsSelectInput };
export type { OptionsSelectValue };
