import { Store } from '@sotaoi/client/contracts';
import { Lang, State, Seed } from '@sotaoi/omni/state';
import { AuthRecord } from '@sotaoi/omni/artifacts';
import { StoreCreator } from 'redux';
import { BaseForm } from '@sotaoi/client/forms/form-classes/base-form';
import { Storage, InputValidator } from '@sotaoi/client/contracts';
import { Navigation } from '@sotaoi/client/router/navigation';
import { Helper } from '@sotaoi/client/helper';

let unsubscribe: () => void = () => undefined;

interface AppTitleAction {
  type: 'app.meta.title';
  value: string;
}
interface AuthRecordAction {
  type: 'app.credentials.authRecord';
  value: null | AuthRecord;
}
interface SelectedLangAction {
  type: 'app.lang.selected';
  value: Lang;
}
interface DefaultLangAction {
  type: 'app.lang.default';
  value: Lang;
}
type Action = AppTitleAction | AuthRecordAction | SelectedLangAction | DefaultLangAction;

class StoreService extends Store {
  protected currentPath: null | string;

  constructor(apiUrl: string, createStore: StoreCreator, inputValidator: InputValidator, storage: Storage) {
    super(apiUrl, createStore, inputValidator, storage);
    this.currentPath = null;
  }

  public async init(): Promise<void> {
    unsubscribe();

    let seed: null | Seed = null;
    let getSeedTries = 0;

    const accessToken = JSON.parse((await this.storage.get('authRecord')) || '{}').accessToken || '';
    this.currentPath = (await this.storage.get('currentPath')) || '/';

    const getSeed = async (): Promise<void> => {
      const formData = new FormData();
      formData.append('accessToken', accessToken);
      seed = await (await fetch(`${this.apiUrl}/seed`, { method: 'POST', body: formData })).json();
    };

    while (!seed && getSeedTries < 15) {
      try {
        await getSeed();
      } catch (err) {
        getSeedTries++;
        err && err.stack ? console.warn(err.name, err.message, err.stack) : console.warn(err);
        await new Promise((resolve) => setTimeout(resolve, 1000));
      }
    }
    if (!seed) {
      throw new Error('failed to fetch seed');
    }

    BaseForm.setup(this.inputValidator);

    this.initialState = {
      'app.meta.title': '',
      'app.credentials.authRecord': seed['app.credentials.authRecord'],
      'app.lang.selected': seed['app.lang.selected'],
      'app.lang.default': seed['app.lang.default'],
      'app.lang.available': seed['app.lang.available'],
    };

    this.store = this.createStore<State, Action, any, any>((state = this.initialState, action: Action) => {
      switch (action.type) {
        case 'app.meta.title':
          return {
            ...state,
            'app.meta.title': action.value,
          };
        case 'app.credentials.authRecord':
          return {
            ...state,
            'app.credentials.authRecord': action.value,
          };
        case 'app.lang.selected':
          return {
            ...state,
            'app.lang.selected': action.value,
          };
        case 'app.lang.default':
          return {
            ...state,
            'app.lang.default': action.value,
          };
        default:
          return state;
      }
    });

    unsubscribe = this.store.subscribe(() => Navigation.refresh());
  }

  public async setAuthRecord(authRecord: null | AuthRecord): Promise<void> {
    // todo here: change storage strategy to secure one
    this.store.dispatch({
      type: 'app.credentials.authRecord',
      value: authRecord,
    });
    this.storage.set('authRecord', authRecord);
  }

  public async setCurrentPath(currentPath: string): Promise<void> {
    this.currentPath = currentPath;
    await this.storage.set('currentPath', currentPath);
  }
  public getCurrentPath(): string {
    return this.currentPath || '/';
  }

  public getAuthRecord(): null | AuthRecord {
    return this.store.getState()?.['app.credentials.authRecord'] || null;
  }

  public getAccessToken(): null | string {
    return this.getState()?.['app.credentials.authRecord']?.accessToken || null;
  }

  public hasMultiLang(): boolean {
    // nothing here yet
    return false;
  }

  public setTitle(title: string): void {
    Helper.setTitle(title);
    this.store.dispatch({ type: 'app.meta.title', value: title });
  }

  public setSelectedLang(lang: Lang): void {
    this.store.dispatch({ type: 'app.lang.selected', value: lang });
  }

  public setDefaultLang(lang: Lang): void {
    this.store.dispatch({ type: 'app.lang.default', value: lang });
  }

  public getSelectedLang(): Lang {
    return this.store.getState()['app.lang.selected'];
  }

  public getDefaultLang(): Lang {
    return this.store.getState()['app.lang.default'];
  }

  public getAvailableLangs(): Lang[] {
    return this.store.getState()['app.lang.available'];
  }

  public subscribe(callback: () => void): () => void {
    return this.store.subscribe(callback);
  }

  public getState(): State {
    return this.store.getState();
  }

  public getApiUrl(): string {
    return this.apiUrl;
  }
}

export { StoreService };
