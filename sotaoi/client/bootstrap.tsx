import React from 'react';
import ReactDom from 'react-dom';
import { StoreCreator } from 'redux';
import { Store, Storage, InputValidator, Socket } from '@sotaoi/client/contracts';
import { StoreService } from '@sotaoi/client/services/store-service';
import { SocketService } from '@sotaoi/client/services/socket-service';
import { ControlPanelService } from '@sotaoi/client/services/control-panel-service';
import { Helper } from '@sotaoi/client/helper';
import { AppKernel } from '@sotaoi/client/app-kernel';
import { store } from '@sotaoi/client/store';
import { AppInfo } from '@sotaoi/omni/state';
import { socket } from '@sotaoi/client/socket';

class Bootstrap {
  static routerComponent: null | React.ReactElement = null;

  public static async init(
    appTitle: string,
    appInfo: AppInfo,
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
            return new StoreService(appInfo, apiUrl, createStore, inputValidator, storage);
          },
        );

      // Socket
      !app().has(Socket) &&
        app().singleton<Socket>(
          Socket,
          (): SocketService => {
            return new SocketService();
          },
        );

      // Control Panel
      !app().has(ControlPanelService) &&
        app().singleton<ControlPanelService>(
          ControlPanelService,
          (): ControlPanelService => {
            return new ControlPanelService();
          },
        );
    });
    Helper.setTitle(appTitle);

    const init = async (): Promise<void> => {
      socket().connect(`${appInfo.streamingBaseUrl}:${appInfo.streamingPort}`, {
        transports: ['websocket'],
      });
      await store().init();
    };

    switch (true) {
      case Helper.isWeb():
        try {
          ReactDom.render(<Loading />, document.getElementById('bootstrap'));
          await init();
          ReactDom.render(routerComponent, document.getElementById('bootstrap'));
        } catch (err) {
          console.error(err);
          ReactDom.render(<ErrorComponent error={err} />, document.getElementById('bootstrap'));
        }
        break;
      case Helper.isMobile():
        await init();
        break;
      case Helper.isElectron():
        // no loader here yet
        await init();
        // nothing here yet
        break;
      default:
        throw new Error('unknown environment');
    }
  }
}

export { Bootstrap };
