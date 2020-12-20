import { AppContainer } from '@sotaoi/client/app-container';
import { Storage, InputValidator } from '@sotaoi/client/contracts';
import { StorageService } from '@sotaoi/client/services/storage-service';
import { InputValidatorOmni } from '@sotaoi/omni/services/input-validator-omni';

let appContainer: AppContainer;
let app: () => AppContainer = () => appContainer;

class AppKernel {
  public bootstrapped: boolean;

  constructor() {
    this.bootstrapped = false;
    appContainer = new AppContainer();
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
    // input validator
    app().singleton<InputValidator>(
      InputValidator,
      (): InputValidatorOmni => {
        return new InputValidatorOmni({}, null, () => Promise.resolve([]));
      },
    );

    // storage
    app().singleton<Storage>(
      Storage,
      (): StorageService => {
        return new StorageService(['authRecord', 'currentPath']);
      },
    );
  }
}

export { AppKernel, app };
