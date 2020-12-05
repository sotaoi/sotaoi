import React from 'react';
import ReactDom from 'react-dom';
import { StoreCreator } from 'redux';
import { Store, Storage, InputValidator } from '@sotaoi/client/contracts';
import { StoreService } from '@sotaoi/client/services/store-service';
import { Helper } from '@sotaoi/client/helper';
import { AppKernel } from '@sotaoi/client/app-kernel';
import { store } from '@sotaoi/client/store';

class Bootstrap {
  static routerComponent: null | React.ReactElement = null;

  public static async init(
    appTitle: string,
    apiUrl: string,
    appKernel: AppKernel,
    routerComponent: React.ReactElement,
    createStore: StoreCreator,
    Loading: React.FunctionComponent,
    ErrorComponent: React.FunctionComponent<{ error: Error }>,
  ): Promise<void> {
    appKernel.bootstrap((app) => {
      const inputValidator = app().get<InputValidator>(InputValidator);
      const storage = app().get<Storage>(Storage);

      // Store
      !app().has(Store) &&
        app().singleton<Store>(
          Store,
          (): StoreService => {
            return new StoreService(apiUrl, createStore, inputValidator, storage);
          },
        );
    });
    Helper.setTitle(appTitle);

    switch (true) {
      case Helper.isWeb():
        try {
          ReactDom.render(<Loading />, document.getElementById('bootstrap'));
          await store().init();
          ReactDom.render(routerComponent, document.getElementById('bootstrap'));
        } catch (err) {
          console.error(err);
          ReactDom.render(<ErrorComponent error={err} />, document.getElementById('bootstrap'));
        }
        break;
      case Helper.isMobile():
        await store().init();
        break;
      case Helper.isElectron():
        // nothing here yet
        break;
      default:
        throw new Error('unknown environment');
    }
  }
}

export { Bootstrap };
