import { Storage } from '@sotaoi/api/contracts';
import { FileInput } from '@sotaoi/omni/input';
import fs from 'fs';
import path from 'path';
import { ResponseToolkit, ResponseObject } from '@hapi/hapi';

class StorageService extends Storage {
  constructor(relativeTo: string, rule: (role: string, pathname: string) => Promise<boolean>) {
    super(relativeTo, rule);
  }

  public async save(pathname: string, input: FileInput): Promise<void> {
    pathname = pathname.replace(/^\/+/, '');
    if (!input) {
      throw new Error('trying to save empty file input');
    }
    const destination = path.resolve(this.relativeTo, pathname, input.getValue().filename);
    !fs.existsSync(path.dirname(destination)) && fs.mkdirSync(path.dirname(destination), { recursive: true });
    return fs.copyFileSync(path.resolve(input.getValue().path), destination);
  }
  public async read(pathname: string, role: string, handler: ResponseToolkit): Promise<ResponseObject> {
    pathname = pathname.replace(/^\/+/, '');
    if (!(await this.rule(role, pathname))) {
      throw new Error('something went wrong');
    }
    return handler.file(path.resolve(this.relativeTo, pathname));
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
