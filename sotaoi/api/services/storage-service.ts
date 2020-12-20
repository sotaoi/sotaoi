import { Storage } from '@sotaoi/api/contracts';
import { FileInput } from '@sotaoi/omni/input';
import fs from 'fs';
import path from 'path';

class StorageService extends Storage {
  constructor(relativeTo: string) {
    super(relativeTo);
  }

  public async save(pathname: string, file: FileInput): Promise<void> {
    const destination = this.isDirectory(pathname)
      ? path.resolve(this.relativeTo, pathname, file.getValue().filename)
      : path.resolve(this.relativeTo, pathname);
    return fs.copyFileSync(path.resolve(file.getValue().path), destination);
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
