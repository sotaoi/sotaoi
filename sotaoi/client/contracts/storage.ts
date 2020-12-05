abstract class Storage {
  protected data: null | { [key: string]: any };

  constructor() {
    this.data = null;
  }

  abstract async init(allowedKeys: string[]): Promise<void>;
  abstract async set(key: string, value: any): Promise<void>;
  abstract get(key: string): any;
  abstract async remove(key: string): Promise<void>;
}

export { Storage };
