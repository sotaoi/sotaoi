import { FileInput, BaseInput, Asset, StoredItem } from '@sotaoi/omni/input';
import { BaseField } from '@sotaoi/client/forms';

interface FileUpload {
  path: string;
  filename: string;
  bytes: number;
  file: null | File;
}

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
    return !this.value.length;
  }

  public append(fileInput: FileInput): void {
    this.value.push(fileInput);
  }

  public getFiles(): File[] {
    return this.value.filter((fileInput) => !!fileInput.value.file).map((fileInput) => fileInput.value.file as File);
  }

  public serialize(forStorage: boolean): (string | Blob)[] {
    if (forStorage) {
      throw new Error('multi file input save method is embedded in storage');
    }
    if (!this.getValue().length) {
      return [];
    }
    return (
      this.getValue().map((input) => {
        const file = input.getValue().file;
        const asset = input.getValue().asset;
        if (!file && !asset) {
          throw new Error('something went wrong with multi file input serialization, both filename and asset are null');
        }
        return file || JSON.stringify({ mfi: asset });
      }) || []
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
    if (fieldPayload instanceof Array) {
      return true;
    }
    if (typeof payloadJson.mfi !== 'undefined') {
      return true;
    }
    return false;
  }
  public deserialize(value: (string | FileUpload)[]): MultiFileInput {
    if (!(value instanceof Array)) {
      throw new Error('something went wrong deserializing multi file input');
    }
    if (!value.length) {
      return new MultiFileInput([]);
    }
    const inputs = (value as Array<string | FileUpload>).map((input) => {
      if (typeof input !== 'string') {
        return new FileInput(input.path, input.filename, null, null, input.file || null);
      }
      return new FileInput('', '', new Asset(JSON.parse(input).mfi), null, null);
    });
    return new MultiFileInput(inputs);
  }
}

export { MultiFileInput };
export type { MultiFileFieldType };
