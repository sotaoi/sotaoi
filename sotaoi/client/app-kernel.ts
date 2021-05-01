import { AppContainer } from '@sotaoi/client/app-container';

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
    //
  }
}

export { AppKernel, app };
