import { Storage } from '@sotaoi/client/contracts';
import { Helper } from '@sotaoi/client/helper';
import AsyncStorage from '@react-native-community/async-storage';

class StorageService extends Storage {
  protected allowedKeys: string[];

  constructor(allowedKeys: string[]) {
    super();
    this.allowedKeys = allowedKeys;
  }

  public async set(key: string, value: any): Promise<void> {
    this.checkKey(key);
    await this._set(key, value);
  }

  public async get(key: string): Promise<any> {
    this.checkKey(key);
    return this._get(key);
  }

  public async remove(key: string): Promise<void> {
    this.checkKey(key);
    await this._remove(key);
  }

  protected async _set(key: string, value: any): Promise<void> {
    const stringified = JSON.stringify(value);
    switch (true) {
      case Helper.isWeb():
        window.localStorage.setItem(key, stringified);
        break;
      case Helper.isMobile():
        await AsyncStorage.setItem(key, stringified);
        break;
      case Helper.isElectron():
        console.warn('no electron yet');
        break;
      default:
        throw new Error('unknown environment');
    }
  }

  protected async _get(key: string): Promise<any> {
    switch (true) {
      case Helper.isWeb():
        return window.localStorage.getItem(key) || null;
      case Helper.isMobile():
        return (await AsyncStorage.getItem(key)) || null;
      case Helper.isElectron():
        throw new Error('no electron yet');
      default:
        throw new Error('unknown environment');
    }
  }

  protected async _remove(key: string): Promise<void> {
    switch (true) {
      case Helper.isWeb():
        window.localStorage.removeItem(key);
        break;
      case Helper.isMobile():
        await AsyncStorage.removeItem(key);
        break;
      case Helper.isElectron():
        throw new Error('no electron yet');
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
