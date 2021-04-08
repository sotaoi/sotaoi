import { Helper as OmniHelper } from '@sotaoi/omni/helper';
import { v4 as uuidv4 } from 'uuid';
import crypto from 'crypto';
import fs from 'fs';
import path from 'path';
import jsonic from 'jsonic';

interface FileInfo {
  dir: string;
  filename: string;
  fullpath: string;
  extension: string;
  isDir: boolean;
  isFile: boolean;
}

class Helper extends OmniHelper {
  public static uuid(): string {
    return uuidv4();
  }

  public static sha1(str: string): string {
    return crypto.createHash('sha1').update(str).digest('hex');
  }

  public static rootPath(pathInRoot = ''): string {
    const rootPath = path.resolve(path.dirname(require.resolve('@sotaoi/omni/package.json')), '../../');
    return path.resolve(rootPath, pathInRoot);
  }

  public static extractJson(path: string): { [key: string]: any } {
    const string = fs.readFileSync(path).toString();
    const firstBracketPos = string.indexOf('{');
    const lastBracketPos = string.lastIndexOf('}');
    return jsonic(string.slice(firstBracketPos, lastBracketPos + 1).replace(/\n/g, ''));
  }

  public static copyRecursiveSync(src: string, dest: string): void {
    const stats = fs.existsSync(src) ? fs.statSync(src) : false;
    const isDirectory = !!stats && stats.isDirectory();
    if (isDirectory) {
      fs.mkdirSync(dest);
      fs.readdirSync(src).forEach((childItemName) => {
        this.copyRecursiveSync(path.join(src, childItemName), path.join(dest, childItemName));
      });
    } else {
      fs.copyFileSync(src, dest);
    }
  }

  public static readdirSync(
    dir: string,
  ): { dir: string; filename: string; fullpath: string; extension: string; isDir: boolean; isFile: boolean }[] {
    return fs.readdirSync(dir).map((item) => {
      const fullpath = path.resolve(dir, item);
      const isDir = fs.lstatSync(fullpath).isDirectory();
      return {
        dir,
        filename: item,
        fullpath,
        extension: path.extname(item),
        isDir,
        isFile: !isDir,
      };
    });
  }

  public static readdirSyncRecur(dir: string, exclude: string[] = [], files: FileInfo[] = []): FileInfo[] {
    fs.readdirSync(dir).map((item) => {
      const fullpath = path.resolve(dir, item);
      const isDir = fs.lstatSync(fullpath).isDirectory();
      if (isDir && exclude.indexOf(item) === -1) {
        this.readdirSyncRecur(fullpath, exclude, files);
      }
      files.push({
        dir,
        filename: item,
        fullpath,
        extension: path.extname(item),
        isDir,
        isFile: !isDir,
      });
    });
    return files;
  }

  public static copyFileSync(from: string, to: string): void {
    fs.mkdirSync(path.dirname(to), { recursive: true });
    fs.copyFileSync(from, to);
  }
}

export { Helper };
export type { TransformerFn } from '@sotaoi/omni/helper';
