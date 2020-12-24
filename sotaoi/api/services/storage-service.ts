import { Storage, StorageInit, StoredItem, Asset } from '@sotaoi/api/contracts';
import { FileInput } from '@sotaoi/omni/input';
import fs from 'fs';
import path from 'path';
import { ResponseToolkit, ResponseObject } from '@hapi/hapi';

class StorageService extends Storage {
  constructor(init: StorageInit) {
    super(init);
  }

  public handle(item: Omit<StoredItem, 'drive'>, input: null | FileInput): [() => void, Asset, () => void] {
    const save = (): void => {
      if (!input || !input.getValue().path) {
        return;
      }
      const destination = path.resolve(this.relativeTo, item.domain, item.pathname);
      !fs.existsSync(path.dirname(destination)) && fs.mkdirSync(path.dirname(destination), { recursive: true });
      return fs.copyFileSync(path.resolve(input.getValue().path), destination);
    };
    const storedItem = new Asset({
      drive: this.drive,
      domain: item.domain,
      pathname: item.pathname,
    });
    const remove = (): void => {
      const filepath = path.resolve(this.relativeTo, item.domain, item.pathname);
      fs.existsSync(filepath) && fs.lstatSync(filepath).isFile() && fs.unlinkSync(filepath);
    };

    return [save, storedItem, remove];
  }
  public async read(handler: ResponseToolkit, role: string, item: Omit<StoredItem, 'drive'>): Promise<ResponseObject> {
    if (!(await this.rule(handler, role, { ...item, drive: this.drive }))) {
      throw new Error('permission denied');
    }
    return handler.file(path.resolve(this.relativeTo, item.domain, item.pathname));
  }
  public async remove(file: FileInput): Promise<void> {
    return fs.unlinkSync(path.resolve(this.relativeTo, file.getValue().path));
  }
  public async readdir(dirname: string): Promise<string[]> {
    return fs.readdirSync(path.resolve(this.relativeTo, dirname));
  }
  public async exists(item: string): Promise<boolean> {
    return fs.existsSync(path.resolve(this.relativeTo, item));
  }
  public async isFile(asset: Asset): Promise<boolean> {
    return fs.lstatSync(path.resolve(this.relativeTo, asset.domain, asset.pathname)).isFile();
  }
  public async isDirectory(item: string): Promise<boolean> {
    return fs.lstatSync(path.resolve(this.relativeTo, item)).isDirectory();
  }
  public async getFileInfo(asset: Asset): Promise<any> {
    return fs.lstatSync(path.resolve(this.relativeTo, asset.domain, asset.pathname));
  }
}

export { StorageService };
