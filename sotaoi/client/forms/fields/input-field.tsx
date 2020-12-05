import React from 'react';
import { BaseField, FieldInit } from '@sotaoi/client/forms/fields/base-field';
import { StringInput, BaseInput, FieldValidation } from '@sotaoi/omni/input';
import { InputValidator } from '@sotaoi/client/contracts';
import { Helper } from '@sotaoi/client/helper';
import { TextInput } from 'react-native';

interface InputProps extends React.DetailedHTMLProps<React.InputHTMLAttributes<HTMLInputElement>, HTMLInputElement> {
  onChange: (ev: any) => void;
  value: string;
  secureTextEntry?: boolean;
}
interface ComponentState {
  value: string;
}
class InputField<ComponentProps = InputProps> extends BaseField<StringInput, ComponentProps, ComponentState> {
  constructor(
    name: string,
    key: string,
    getFormValidation: () => InputValidator<(key: string) => void | null | BaseInput<any, any>>,
    validations: FieldValidation[],
    getRerender: () => (force: boolean) => void,
    value: StringInput,
  ) {
    super(name, key, getFormValidation, validations, getRerender, value);
  }

  public init(): FieldInit {
    return {
      value: this.getInputValue(this.value),
      onChange: async (ev: any): Promise<void> => {
        this.set(this.convert(ev.target.value));
        await this.validate();
        this.rerender(true);
      },
      onBlur: async (ev: any): Promise<void> => {
        this.setTouched(true);
        await this.validate();
        this.rerender(true);
      },
    };
  }

  public set(input: StringInput): void {
    this.value = input;
    this._ref?.setValue(input);
  }

  public clear(): void {
    this.setTouched(false);
    this.set(new StringInput(''));
  }

  public isEmpty(): boolean {
    return !this.getInputValue();
  }

  public convert(value: StringInput | null | string): StringInput {
    if (value instanceof StringInput) {
      return value;
    }
    return new StringInput(typeof value === 'string' ? value : '');
  }

  public getInputValue(input: StringInput = this.value): string {
    return input.getValue();
  }

  public wasChanged(): boolean {
    return this.getInputValue() !== this.initialValue.getValue();
  }

  //

  public initialState(props: ComponentProps): ComponentState {
    return { value: (props as any).value.toString() };
  }

  public setValue(input: StringInput, context: React.Component<ComponentProps, ComponentState>): void {
    context.setState({ value: input.getValue() });
  }

  public getValue(context: React.Component<ComponentProps, ComponentState>): string {
    return context.state.value;
  }

  public render(context: React.Component<ComponentProps, ComponentState>): null | React.ReactElement {
    if (Helper.isWeb()) {
      return <input {...context.props} value={context.state.value} />;
    }
    if (Helper.isMobile()) {
      const { onChange, ..._props } = context.props as any;
      return (
        <TextInput
          onChangeText={(value: string): void => onChange({ target: { value } })}
          {...(_props as any)}
          value={context.state.value}
        />
      );
    }
    if (Helper.isElectron()) {
      throw new Error('electron is not implemented');
    }
    throw new Error('unknown environment in input component');
  }

  public static getDerivedStateFromProps(
    nextProps: { [key: string]: any },
    state: { [key: string]: any },
  ): null | { [key: string]: any } {
    return { ...state, value: (nextProps as any).value };
  }
}

export { InputField };
export { StringInput } from '@sotaoi/omni/input';
