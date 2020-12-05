import { BaseInput } from '@sotaoi/omni/input';
import { BaseField } from '@sotaoi/client/forms';

class StringInput extends BaseInput<string, string> {
  constructor(value: string) {
    super(value);
  }

  public input(field: typeof BaseField): { input: StringInput; field: typeof BaseField } {
    return {
      input: this,
      field,
    };
  }

  public getValue(): string {
    return this.value;
  }

  public isEmpty(): boolean {
    return !this.value;
  }

  public serialize(forStorage: boolean): null | string {
    if (forStorage) {
      return this.value;
    }
    return this.value !== '' ? JSON.stringify({ si: this.value }) : '';
  }

  public convert(value: StringInput | string): StringInput {
    if (value instanceof StringInput) {
      return value;
    }
    return new StringInput(typeof value === 'string' ? value : '');
  }

  public deserializeCondition(fieldPayload: any, payloadJson: { [key: string]: any }): boolean {
    return typeof payloadJson.si !== 'undefined';
  }
  public deserialize(value: string): StringInput {
    if (value === '') {
      return new StringInput('');
    }
    const parsed = JSON.parse(value);
    if (typeof parsed !== 'object' || typeof parsed.si !== 'string') {
      throw new Error('bad string input');
    }
    return new StringInput(parsed.si);
  }
}

export { StringInput };
