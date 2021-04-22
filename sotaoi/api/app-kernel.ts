import { AppContainer } from '@sotaoi/api/app-container';
import { Helper } from '@sotaoi/api/helper';
import { InputValidator, Logger, Permissions, Storage, StoredItem } from '@sotaoi/api/contracts';
import { LoggerService } from '@sotaoi/api/services/logger-service';
import { InputValidatorOmni } from '@sotaoi/omni/services/input-validator-omni';
import { PermissionsService } from '@sotaoi/api/services/permissions-service';
import { StorageService } from '@sotaoi/api/services/storage-service';
import path from 'path';
import { ResponseToolkit } from '@hapi/hapi';
import { GenericModel } from './models/generic-model';

let appContainer: AppContainer;
let app: () => AppContainer = () => appContainer;

class AppKernel {
  public bootstrapped: boolean;

  constructor(config: (key: string) => any) {
    this.bootstrapped = false;
    appContainer = new AppContainer(config);
    this.bootstrap();
  }

  public bootstrap(registerFn: void | ((app: () => AppContainer) => void)): void {
    if (!this.bootstrapped) {
      this.bootstrapped = true;
      AppKernel.bootstrap();
    }
    if (registerFn) {
      registerFn(app);
    }
  }

  protected static bootstrap(): void {
    // logger
    !app().has(Logger) &&
      app().singleton<Logger>(
        Logger,
        (): LoggerService => {
          const config = app().config('logger');
          return new LoggerService((rootInPath) => Helper.rootPath(rootInPath), config.log_path);
        },
      );

    // input validator
    !app().has(InputValidator) &&
      app().singleton<InputValidator>(
        InputValidator,
        (): InputValidatorOmni => {
          return new InputValidatorOmni({}, (repository: string) => new GenericModel(repository).db(), null);
        },
      );

    // permissions
    !app().has(Permissions) &&
      app().singleton<Permissions>(
        Permissions,
        (): PermissionsService => {
          return new PermissionsService();
        },
      );

    // storage
    !app().has(Storage) &&
      app().singleton<Storage>(
        Storage,
        (): StorageService => {
          return new StorageService({
            drive: 'main',
            relativeTo: path.resolve('./storage'),
            rule: async (handler: ResponseToolkit, role: string, item: StoredItem): Promise<boolean> => {
              // const accessToken = AuthHandler.getAccessToken(handler);
              // console.info('checking storage permissions');
              // console.info('role:', role);
              // console.info('domain:', item.domain);
              // console.info('pathame:', item.pathname);
              // console.info('access token:', accessToken);
              // console.info('auth record:', await AuthHandler.translateAccessToken(handler, accessToken));

              if (item.domain === 'public') {
                return true;
              }
              return false;
            },
          });
        },
      );
  }
}

export { AppKernel, app };
