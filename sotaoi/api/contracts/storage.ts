import { FileInput } from '@sotaoi/omni/input';
import { ResponseToolkit } from '@hapi/hapi';

interface StorageInit {
  drive: string;
  relativeTo?: string;
  rule?: (handler: ResponseToolkit, role: string, item: StoredItem) => Promise<boolean>;
}

interface StoredItem {
  drive: string;
  domain: string;
  group: string;
  division: string;
  pathname: string;
}

class Asset implements StoredItem {
  public drive: string;
  public domain: string;
  public group: string;
  public division: string;
  public pathname: string;

  constructor(item: StoredItem & { drive: string }) {
    this.drive = item.drive;
    this.domain = item.domain;
    this.group = item.group;
    this.division = item.division;
    this.pathname = item.pathname;
  }

  public serialize(forStorage: boolean): string {
    return JSON.stringify({
      drive: this.drive,
      domain: this.domain,
      group: this.group,
      division: this.division,
      pathname: this.pathname,
    });
  }
}

abstract class Storage {
  abstract save(
    item: Omit<StoredItem, 'drive'>,
    input: null | FileInput,
  ): [() => void, null | Asset, () => void, () => void];
  abstract async read(handler: ResponseToolkit, role: string, item: Omit<StoredItem, 'drive'>): Promise<any>;
  abstract async remove(file: FileInput): Promise<void>;
  abstract async readdir(dirname: string): Promise<string[]>;
  abstract async exists(pathname: string): Promise<boolean>;
  abstract async isFile(dirname: string): Promise<boolean>;
  abstract async isDirectory(dirname: string): Promise<boolean>;

  protected drive: string;
  protected relativeTo: string;
  protected rule: (handler: ResponseToolkit, role: string, item: StoredItem) => Promise<boolean>;

  constructor(init: StorageInit) {
    this.drive = init.drive;
    this.relativeTo = init.relativeTo || '/';
    this.rule =
      init.rule || (async (handler: ResponseToolkit, role: string, item: StoredItem): Promise<boolean> => true);
  }
}

export { Storage, Asset };
export type { StorageInit, StoredItem };
