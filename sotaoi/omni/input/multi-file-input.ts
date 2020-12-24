import { FileInput, BaseInput } from '@sotaoi/omni/input';
import { BaseField } from '@sotaoi/client/forms';

type MultiFileFieldType = null | File[];
class MultiFileInput extends BaseInput<FileInput[], MultiFileFieldType> {
  public value: FileInput[];

  constructor(value: FileInput[]) {
    super(value);
    this.value = value;
  }

  public input(field: typeof BaseField): { input: MultiFileInput; field: typeof BaseField } {
    return {
      input: this,
      field,
    };
  }

  public getValue(): FileInput[] {
    return this.value;
  }

  public isEmpty(): boolean {
    return !!this.value.length;
  }

  public append(fileInput: FileInput): void {
    this.value.push(fileInput);
  }

  public getFiles(): File[] {
    return this.value.filter((fileInput) => !!fileInput.value.file).map((fileInput) => fileInput.value.file as File);
  }

  public serialize(forStorage: boolean): Blob[] {
    if (forStorage) {
      throw new Error('multi file input save not implemented yet');
    }
    return (
      this.value
        .filter((fileInput) => fileInput.value.file instanceof File && !!fileInput.value.file)
        .map((fileInput) => fileInput.value.file as File) || []
    );
  }

  public convert(value: MultiFileFieldType): MultiFileInput {
    if (!value) {
      return new MultiFileInput([]);
    }
    if (value instanceof MultiFileInput) {
      return value;
    }
    if (value instanceof Array) {
      const multiFileInput = new MultiFileInput([]);
      this.value.map((fileInput) => {
        if (!(fileInput.value.file instanceof File)) {
          throw new Error('something went wrong running "convert" in MultiFileInput');
        }
        // !!!! fileInput.value.file.size
        multiFileInput.value.push(
          new FileInput(
            '',
            fileInput.value.file.name,
            null,
            URL.createObjectURL(fileInput.value.file),
            fileInput.value.file,
          ),
        );
      });
      return multiFileInput;
    }
    throw new Error('something went wrong running "convert" in MultiFileInput');
  }

  public deserializeCondition(fieldPayload: any, payloadJson: { [key: string]: any }): boolean {
    return fieldPayload instanceof Array;
  }
  public deserialize(value: { [key: string]: any }[]): MultiFileInput {
    return new MultiFileInput(
      // !!!! value.file.bytes
      value.map(
        // !! may asset be instantiated here (in pos 3)?
        (value) => new FileInput(value.file.path, value.file.value.filename, null, null, null),
      ),
    );
  }
}

export { MultiFileInput };
export type { MultiFileFieldType };
