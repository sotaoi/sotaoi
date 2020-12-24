import { FileInput, MultiFileInput, Asset, StoredItem } from '@sotaoi/omni/input';
import { ResponseToolkit } from '@hapi/hapi';

interface StorageInit {
  drive: string;
  relativeTo?: string;
  rule?: (handler: ResponseToolkit, role: string, item: StoredItem) => Promise<boolean>;
}

abstract class Storage {
  abstract handle(item: Omit<StoredItem, 'drive'>, input: null | FileInput): [() => void, Asset, () => void];
  abstract multiHandle(
    item: Omit<StoredItem, 'drive'>,
    input: null | MultiFileInput,
  ): [() => void, Asset[], () => void];
  abstract async read(handler: ResponseToolkit, role: string, item: Omit<StoredItem, 'drive'>): Promise<any>;
  abstract async remove(file: FileInput): Promise<void>;
  abstract async readdir(dirname: string): Promise<string[]>;
  abstract async exists(item: string): Promise<boolean>;
  abstract async isFile(asset: Asset): Promise<boolean>;
  abstract async isDirectory(item: string): Promise<boolean>;
  abstract async getFileInfo(asset: Asset): Promise<any>;

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
