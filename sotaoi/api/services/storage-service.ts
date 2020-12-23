import { Storage, StorageInit, StoredItem, Asset } from '@sotaoi/api/contracts';
import { FileInput } from '@sotaoi/omni/input';
import fs from 'fs';
import path from 'path';
import { ResponseToolkit, ResponseObject } from '@hapi/hapi';

class StorageService extends Storage {
  constructor(init: StorageInit) {
    super(init);
  }

  public save(
    item: Omit<StoredItem, 'drive'>,
    input: null | Omit<StoredItem, 'drive'> | FileInput,
  ): [() => void, null | Asset, () => void, () => void] {
    const save = (): void => {
      if (!(input instanceof FileInput)) {
        return;
      }
      const destination = path.resolve(this.relativeTo, item.domain, item.group, item.division, item.pathname);
      !fs.existsSync(path.dirname(destination)) && fs.mkdirSync(path.dirname(destination), { recursive: true });
      return fs.copyFileSync(path.resolve(input.getValue().path), destination);
    };
    const storedItem = new Asset({
      drive: this.drive,
      domain: item.domain,
      group: item.group,
      division: item.division,
      pathname: item.pathname,
    });
    const cancel = (): void => {
      if (!input || !(input instanceof FileInput)) {
        return;
      }
      fs.unlinkSync(path.resolve(input.getValue().path));
    };
    const remove = (): void => {
      if (!input || input instanceof FileInput) {
        return;
      }
      if (
        typeof input.domain !== 'string' ||
        typeof input.group !== 'string' ||
        typeof input.division !== 'string' ||
        typeof input.pathname !== 'string' ||
        !input.domain ||
        !input.group ||
        !input.division ||
        !input.pathname
      ) {
        return;
      }
      input = input as Omit<StoredItem, 'drive'>;
      fs.unlinkSync(path.resolve(this.relativeTo, input.domain, input.group, input.division, input.pathname));
    };

    if (!(input instanceof FileInput) || !input.getValue().path) {
      return [
        (): void => undefined,
        input
          ? new Asset({
              drive: this.drive,
              domain: item.domain,
              group: item.group,
              division: item.division,
              pathname: item.pathname,
            })
          : null,
        (): void => undefined,
        remove,
      ];
    }
    return [save, storedItem, cancel, remove];
  }
  public async read(handler: ResponseToolkit, role: string, item: Omit<StoredItem, 'drive'>): Promise<ResponseObject> {
    if (!(await this.rule(handler, role, { ...item, drive: this.drive }))) {
      throw new Error('permission denied');
    }
    return handler.file(path.resolve(this.relativeTo, item.domain, item.group, item.division, item.pathname));
  }
  public async remove(file: FileInput): Promise<void> {
    return fs.unlinkSync(path.resolve(this.relativeTo, file.getValue().path));
  }
  public async readdir(dirname: string): Promise<string[]> {
    return fs.readdirSync(path.resolve(this.relativeTo, dirname));
  }
  public async exists(pathname: string): Promise<boolean> {
    return fs.existsSync(path.resolve(this.relativeTo, pathname));
  }
  public async isFile(dirname: string): Promise<boolean> {
    return fs.lstatSync(path.resolve(this.relativeTo, dirname)).isFile();
  }
  public async isDirectory(dirname: string): Promise<boolean> {
    return fs.lstatSync(path.resolve(this.relativeTo, dirname)).isDirectory();
  }
}

export { StorageService };
