import { BaseInput } from '@sotaoi/omni/input';
import { BaseField } from '@sotaoi/client/forms';

interface StoredItem {
  drive: null | string;
  domain: string;
  pathname: string;
}

interface MultiStoredItem {
  drive: null | string;
  domain: string;
  getPathname: (input: FileInput) => string;
}

class Asset implements StoredItem {
  public drive: null | string;
  public domain: string;
  public pathname: string;

  constructor(item: null | StoredItem) {
    if (!item) {
      this.drive = null;
      this.domain = '';
      this.pathname = '';
      return;
    }
    this.drive = item.drive;
    this.domain = item.domain;
    this.pathname = item.pathname;
  }

  public isEmpty(): boolean {
    return !this.drive && !this.domain && !this.pathname;
  }

  public serialize(forStorage: boolean): null | string {
    if (this.isEmpty()) {
      return null;
    }
    return JSON.stringify({
      drive: this.drive,
      domain: this.domain,
      pathname: this.pathname,
    });
  }

  public static serializeMulti(assets: Asset[]): null | string {
    if (!assets.length) {
      return null;
    }
    return JSON.stringify(assets);
  }
}

class MultiAsset implements MultiStoredItem {
  public drive: null | string;
  public domain: string;
  public getPathname: (input: FileInput) => string;

  constructor(item: MultiStoredItem) {
    this.drive = item.drive;
    this.domain = item.domain;
    this.getPathname = item.getPathname;
  }

  public serialize(forStorage: boolean): string {
    return JSON.stringify({
      drive: this.drive,
      domain: this.domain,
      // getPathname: this.getPathname,
    });
  }
}

interface FileValue {
  path: string;
  filename: string;
  asset: Asset;
  url: null | string;
  file: null | File;
}
type FileFieldType = null | File;
class FileInput extends BaseInput<FileValue, FileFieldType> {
  public value: FileValue;

  constructor(path: string, filename: string, storedItem: null | StoredItem, url: null | string, file: null | File) {
    const value = {
      path,
      filename,
      asset: new Asset(storedItem || null),
      url,
      file,
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

  public getPreview(): string {
    const url = this.getValue().url;
    if (!url && this.getValue().asset) {
      return this.asset(this.getValue().asset?.serialize(false) || '') || '';
    }
    return url || '';
  }

  public isEmpty(): boolean {
    return !this.value.asset && !this.value.path && !this.value.file;
  }

  public serialize(forStorage: boolean): string | Blob {
    if (forStorage) {
      throw new Error('file input save method is embedded in storage');
    }
    return this.value.file || JSON.stringify({ fi: this.value.asset?.serialize(forStorage) || null });
  }

  public convert(value: FileInput | FileFieldType): FileInput {
    if (!value) {
      return new FileInput('', '', null, null, null);
    }
    if (value instanceof FileInput) {
      return value;
    }
    if (value instanceof File) {
      return new FileInput('', value.name, null, URL.createObjectURL(value), value);
    }
    throw new Error('something went wrong running "convert" in FileInput');
  }

  public deserializeCondition(fieldPayload: any, payloadJson: { [key: string]: any }): boolean {
    return (
      typeof payloadJson.fi !== 'undefined' || (!!payloadJson.path && !!payloadJson.filename && !!payloadJson.bytes)
    );
  }
  public deserialize(value: string | { path: string; filename: string; bytes: number; file: null | File }): FileInput {
    // v1 -> { fi: null }
    // v2 -> file uploaded, you have path
    // v3 -> file input is null, in order to remove. this does not get processed
    // v4 -> file not uploaded, nothing changes, you have asset
    if (typeof value === 'string') {
      const parsed = JSON.parse(value);
      return new FileInput('', '', parsed.fi ? new Asset(JSON.parse(parsed.fi)) : null, null, null);
    }
    return new FileInput(value.path, value.filename, null, null, value.file || null);
  }
}

export { FileInput, Asset, MultiAsset };
export type { FileFieldType, FileValue, StoredItem, MultiStoredItem };
