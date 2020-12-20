import { AppContainer } from '@sotaoi/api/app-container';
import { db } from '@sotaoi/api/db';
import { Helper } from '@sotaoi/api/helper';
import { InputValidator, Logger, Permissions, Storage } from '@sotaoi/api/contracts';
import { LoggerService } from '@sotaoi/api/services/logger-service';
import { InputValidatorOmni } from '@sotaoi/omni/services/input-validator-omni';
import { PermissionsService } from '@sotaoi/api/services/permissions-service';
import { StorageService } from '@sotaoi/api/services/storage-service';
import path from 'path';

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
          return new InputValidatorOmni({}, db, null);
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

    // permissions
    !app().has(Storage) &&
      app().singleton<Storage>(
        Storage,
        (): StorageService => {
          return new StorageService(path.resolve('./storage'));
        },
      );
  }
}

export { AppKernel, app };
