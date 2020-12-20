import { FileInput } from '@sotaoi/omni/input';

abstract class Storage {
  abstract async save(pathname: string, file: FileInput): Promise<void>;
  abstract async remove(file: FileInput): Promise<void>;
  abstract async readdir(dirname: string): Promise<string[]>;
  abstract async exists(pathname: string): Promise<boolean>;
  abstract async isFile(dirname: string): Promise<boolean>;
  abstract async isDirectory(dirname: string): Promise<boolean>;

  protected relativeTo: string;

  constructor(relativeTo: string) {
    this.relativeTo = relativeTo;
  }
}

export { Storage };
