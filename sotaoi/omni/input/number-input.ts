import { BaseInput } from '@sotaoi/omni/input';
import { BaseField } from '@sotaoi/client/forms';

class NumberInput extends BaseInput<number, number> {
  public value: number;
  constructor(value: number) {
    super(value);
    this.value = value;
  }

  public input(field: typeof BaseField): { input: NumberInput; field: typeof BaseField } {
    return {
      input: this,
      field,
    };
  }

  public getValue(): number {
    return this.value;
  }

  public isEmpty(): boolean {
    return false;
  }

  public serialize(forStorage: boolean): string {
    if (forStorage) {
      return this.value.toString();
    }
    return JSON.stringify({ v: this.value });
  }

  public convert(value: NumberInput | number): NumberInput {
    if (value instanceof NumberInput) {
      return value;
    }
    if (typeof value !== 'number') {
      throw new Error('failed to parse number input');
    }
    return new NumberInput(value);
  }

  public deserializeCondition(fieldPayload: any, payloadJson: { [key: string]: any }): boolean {
    return typeof payloadJson.v === 'number' && Object.keys(payloadJson).length === 1;
  }
  public deserialize(value: string): NumberInput {
    const parsed = JSON.parse(value);
    if (typeof parsed !== 'object' || (typeof parsed.value !== 'number' && isNaN(parsed.value))) {
      throw new Error('failed to parse number input');
    }
    return new NumberInput(parsed.value);
  }
}

export { NumberInput };
