import { Lang, State, AppInfo } from '@sotaoi/omni/state';
import { AuthRecord } from '@sotaoi/omni/artifacts';
import { StoreCreator, Store as ReduxStore } from 'redux';
import { InputValidator, Storage } from '@sotaoi/client/contracts';

type StoreType = { getState: () => { [key: string]: any }; dispatch: any; subscribe: any } | ReduxStore;

abstract class Store {
  protected appInfo: AppInfo;
  protected apiUrl: string;
  protected createStore: StoreCreator;
  protected inputValidator: InputValidator;
  protected storage: Storage;

  protected store: StoreType;
  protected initialState: State;

  constructor(
    appInfo: AppInfo,
    apiUrl: string,
    createStore: StoreCreator,
    inputValidator: InputValidator,
    storage: Storage,
  ) {
    this.appInfo = appInfo;
    this.apiUrl = apiUrl;
    this.createStore = createStore;
    this.inputValidator = inputValidator;
    this.storage = storage;
    this.store = {
      getState: () => (): { [key: string]: any } => ({}),
      dispatch: () => (): void => undefined,
      subscribe: () => (): void => undefined,
    };
    this.initialState = {
      'app.meta.title': '',
      'app.credentials.authRecord': null,
      'app.lang.selected': { code: 'en', name: 'English' },
      'app.lang.default': { code: 'en', name: 'English' },
      'app.lang.available': [{ code: 'en', name: 'English' }],
    };
  }

  abstract async init(): Promise<void>;
  abstract async setAuthRecord(authRecord: null | AuthRecord, accessToken: null | string): Promise<void>;
  abstract async setCurrentPath(currentPath: string): Promise<void>;
  abstract getCurrentPath(): string;
  abstract getAuthRecord(): null | AuthRecord;
  abstract getAccessToken(): null | string;
  abstract hasMultiLang(): boolean;
  abstract setTitle(title: string): void;
  abstract setSelectedLang(lang: Lang): void;
  abstract setDefaultLang(lang: Lang): void;
  abstract getSelectedLang(): Lang;
  abstract getDefaultLang(): Lang;
  abstract getAvailableLangs(): Lang[];
  abstract subscribe(callback: () => void): () => void;
  abstract getState(): State;
  abstract getAppInfo(): AppInfo;
  abstract getApiUrl(): string;
}

export { Store };
