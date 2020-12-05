import { Storage } from '@sotaoi/client/contracts';
import { Helper } from '@sotaoi/client/helper';
import AsyncStorage from '@react-native-community/async-storage';

class StorageService extends Storage {
  protected allowedKeys: string[];

  constructor() {
    super();
    this.allowedKeys = [];
  }

  public async init(allowedKeys: string[]): Promise<void> {
    let parsed: any;
    this.allowedKeys = allowedKeys;
    this.data = {};
    try {
      switch (true) {
        case Helper.isWeb():
          parsed = JSON.parse(window.localStorage.getItem('app.storage') || '{}');
          this.data = (typeof parsed === 'object' ? parsed : {}) as { [key: string]: any };
          break;
        case Helper.isMobile():
          parsed = JSON.parse((await AsyncStorage.getItem('app.storage')) || '{}');
          this.data = (typeof parsed === 'object' ? parsed : {}) as { [key: string]: any };
          break;
        case Helper.isElectron():
          console.warn('no electron yet');
          break;
        default:
          throw new Error('unknown environment');
      }
    } catch (err) {
      console.warn(err);
    }
    for (const key of Object.keys(this.data)) {
      this.allowedKeys.indexOf(key) === -1 && delete this.data[key];
    }
    await this.save(true);
  }

  public async set(key: string, value: any): Promise<void> {
    this.checkKey(key);
    if (!this.data) {
      throw new Error('something went wrong - tried to set, but storage is not init');
    }
    this.data[key] = value;
    await this.save(true);
  }

  public get(key: string): any {
    this.checkKey(key);
    if (!this.data) {
      throw new Error('something went wrong - tried to set, but storage is not init');
    }
    return this.data[key];
  }

  public async remove(key: string): Promise<void> {
    this.checkKey(key);
    if (!this.data) {
      throw new Error('something went wrong - tried to set, but storage is not init');
    }
    delete this.data[key];
    await this.save(false);
  }

  protected async save(update: boolean): Promise<void> {
    const stringified = JSON.stringify(this.data);
    update && (this.data = JSON.parse(stringified));
    switch (true) {
      case Helper.isWeb():
        window.localStorage.setItem('app.storage', stringified);
        break;
      case Helper.isMobile():
        await AsyncStorage.setItem('app.storage', stringified);
        break;
      case Helper.isElectron():
        console.warn('no electron yet');
        break;
      default:
        throw new Error('unknown environment');
    }
  }

  protected checkKey(key: string): void {
    if (this.allowedKeys.indexOf(key) === -1) {
      throw new Error(`storage key '${key}' not allowed`);
    }
  }
}

export { StorageService };
