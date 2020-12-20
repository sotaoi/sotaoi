abstract class Storage {
  abstract async set(key: string, value: any): Promise<void>;
  abstract async get(key: string): Promise<any>;
  abstract async remove(key: string): Promise<void>;
}

export { Storage };
