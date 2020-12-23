import React from 'react';
import { BaseField, FieldInit } from '@sotaoi/client/forms/fields/base-field';
import { BaseInput, FileInput, FileValue, FileFieldType, FieldValidation } from '@sotaoi/omni/input';
import { InputValidator } from '@sotaoi/client/contracts';
import { Helper } from '@sotaoi/client/helper';

type ComponentStateValue = null | File;
interface ComponentProps
  extends React.DetailedHTMLProps<React.InputHTMLAttributes<HTMLInputElement>, HTMLInputElement> {
  value: any;
}
interface ComponentState {
  value: ComponentStateValue;
}
class FileField extends BaseField<FileInput, ComponentProps, ComponentState> {
  public ref: null | HTMLInputElement;

  constructor(
    name: string,
    key: string,
    getFormValidation: () => InputValidator<(key: string) => void | null | BaseInput<any, any>>,
    validations: FieldValidation[],
    getRerender: () => (force: boolean) => void,
    value: FileInput,
  ) {
    super(name, key, getFormValidation, validations, getRerender, value);
    this.ref = null;
  }

  public init(): FieldInit {
    return {
      value: this.getInputValue(this.value),
      onChange: async (ev: any): Promise<void> => {
        this.setTouched(true);
        if (!ev.target.files.length) {
          this.set(this.convert(null));
          await this.validate();
          this.rerender(true);
          return;
        }
        this.set(ev.target.files[0]);
        await this.validate();
        this.rerender(true);
      },
      onBlur: async (ev: any): Promise<void> => {
        //
      },
    };
  }

  public clear(): void {
    this.set(this.convert(null));
    this.rerender(true);
  }

  public isEmpty(): boolean {
    return !this.value || (!this.getInputValue().filename && !this.getInputValue().url && !this.getInputValue().file);
  }

  public set(value: FileInput): void {
    this.value = this.convert(value);
    this._ref?.setValue(this.value);
  }

  public convert(value: null | string | FileInput | FileFieldType): FileInput {
    if (!value) {
      return new FileInput('', '', '', '', 0, null, '');
    }
    if (typeof value === 'string') {
      return new FileInput('', '', value, '', 0, null, value);
    }
    if (value instanceof FileInput) {
      return value as FileInput;
    }
    if (value instanceof File) {
      return new FileInput('', value.name, '', value.type, value.size, value, URL.createObjectURL(value));
    }
    throw new Error('file convert error');
  }

  public getInputValue(input: FileInput = this.value): FileValue {
    return input.getValue();
  }

  public wasChanged(): boolean {
    // todo here: implement
    return true;
  }

  public getPreview(): string {
    return this.asset(this.getInputValue().memUrl) || this.asset(this.getInputValue().url) || '';
  }

  //

  public initialState(props: ComponentProps): ComponentState {
    return { value: props.value ? props.value.file : null };
  }

  public setValue(input: FileInput, context: React.Component<ComponentProps, ComponentState>): void {
    if (!input || !input.getValue().file) {
      this.ref && (this.ref.value = '');
      context.setState({ value: null });
      return;
    }
    context.setState({ value: input.getValue().file });
  }

  public getValue(context: React.Component<ComponentProps, ComponentState>): ComponentStateValue {
    return context.state.value;
  }

  public render(context: React.Component<ComponentProps, ComponentState>): null | React.ReactElement {
    if (Helper.isWeb()) {
      const { value, ..._props } = context.props;
      return <input type={'file'} ref={(ref): null | HTMLInputElement => ref && (this.ref = ref)} {..._props} />;
    }
    if (Helper.isMobile()) {
      throw new Error('mobile is not implemented');
    }
    if (Helper.isElectron()) {
      throw new Error('electron is not implemented');
    }
    throw new Error('unknown environment in file component');
  }

  public static getDerivedStateFromProps(
    nextProps: { [key: string]: any },
    state: { [key: string]: any },
  ): null | { [key: string]: any } {
    return { ...state, value: (nextProps as any).value };
  }
}

export { FileField, FileInput };
