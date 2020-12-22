import { BaseInput } from '@sotaoi/omni/input';
import { BaseField } from '@sotaoi/client/forms';

interface FileValue {
  path: string;
  filename: string;
  url: string;
  type: string;
  size: number;
  file: null | File;
  memUrl: string;
}
type FileFieldType = null | File;
class FileInput extends BaseInput<FileValue, FileFieldType> {
  public value: FileValue;

  constructor(
    path: string,
    filename: string,
    url: string,
    type: string,
    size: number,
    file: null | File,
    memUrl: string,
  ) {
    const value = {
      path,
      filename,
      url,
      type,
      size,
      file,
      memUrl,
    };
    super(value);
    this.value = value;
  }

  public input(field: typeof BaseField): { input: FileInput; field: typeof BaseField } {
    return {
      input: this,
      field,
    };
  }

  public getValue(): FileValue {
    return this.value;
  }

  public isEmpty(): boolean {
    return !this.value.url && !this.value.path && !this.value.memUrl;
  }

  public serialize(forStorage: boolean): string | Blob {
    if (forStorage) {
      throw new Error('file input save not implemented yet');
    }
    return this.value.file || (this.value.url ? JSON.stringify({ fi: this.value.url }) : '');
  }

  public convert(value: FileInput | FileFieldType): FileInput {
    if (!value) {
      return new FileInput('', '', '', '', 0, null, '');
    }
    if (value instanceof FileInput) {
      return value;
    }
    if (value instanceof File) {
      return new FileInput('', value.name, '', value.type, value.size, value, URL.createObjectURL(value));
    }
    throw new Error('something went wrong running "convert" in FileInput');
  }

  public deserializeCondition(fieldPayload: any, payloadJson: { [key: string]: any }): boolean {
    return (
      typeof payloadJson.fi !== 'undefined' || (!!payloadJson.path && !!payloadJson.filename && !!payloadJson.bytes)
    );
  }
  public deserialize(value: string | { path: string; filename: string; bytes: number; file: null | File }): FileInput {
    // todo here: get file bytes at least
    if (typeof value === 'string') {
      return new FileInput('', '', value, '', 0, null, '');
    }
    return new FileInput(value.path, value.filename, '', '', value.bytes, value.file, '');
  }
}

export { FileInput };
export type { FileFieldType, FileValue };
