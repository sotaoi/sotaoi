import { BaseInput } from '@sotaoi/omni/input';
import { BaseField } from '@sotaoi/client/forms';

type StringSelectValue = null | string;
class StringSelectInput extends BaseInput<StringSelectValue, string> {
  public value: StringSelectValue;
  constructor(value: StringSelectValue) {
    super(value);
    this.value = value;
  }

  public input(field: typeof BaseField): { input: StringSelectInput; field: typeof BaseField } {
    return {
      input: this,
      field,
    };
  }

  public getValue(): StringSelectValue {
    return this.value;
  }

  public isEmpty(): boolean {
    return !this.value;
  }

  public serialize(forStorage: boolean): null | string {
    if (forStorage) {
      return this.value || null;
    }
    return JSON.stringify({ ssi: this.value || null });
  }

  public convert(value: StringSelectValue | StringSelectInput): StringSelectInput {
    return StringSelectInput.convert(value);
  }

  public deserializeCondition(fieldPayload: any, payloadJson: { [key: string]: any }): boolean {
    return typeof payloadJson.ssi !== 'undefined';
  }
  public deserialize(value: string): StringSelectInput {
    const parsed = JSON.parse(value);
    if (typeof parsed.ssi !== 'string' && parsed.ssi !== null) {
      throw new Error('failed to parse string select input');
    }
    return new StringSelectInput(parsed.ssi);
  }

  public static convert(value: StringSelectValue | StringSelectInput): StringSelectInput {
    if (!value) {
      return new StringSelectInput(null);
    }
    if (value instanceof StringSelectInput) {
      return value;
    }
    if (typeof value === 'string') {
      return new StringSelectInput(value);
    }
    throw new Error('failed to parse string select input');
  }
}

export { StringSelectInput };
export type { StringSelectValue };
