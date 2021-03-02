import TextEncoding from 'text-encoding';
declare const global: {
  HermesInternal: null | { [key: string]: any };
  TextEncoder: any;
  TextDecoder: any;
};
global.TextEncoder = TextEncoding.TextEncoder;
window.TextEncoder = global.TextEncoder;
global.TextDecoder = TextEncoding.TextDecoder;
window.TextDecoder = global.TextDecoder;

import React from 'react';
import { Router } from '@sotaoi/client/router';
import { Bootstrap } from '@sotaoi/client/bootstrap';
import { createStore } from 'redux';
import { routerProps } from '@app/client/router-props';
import { Loading } from '@app/client/components/loading';
import { ErrorComponent } from '@app/client/components/error-component';
import { getAppInfo } from '@app/omni/get-app-info';
import { AppKernel } from '@sotaoi/client/app-kernel';
import { Provider as PaperProvider } from 'react-native-paper';

const appInfo = getAppInfo();
const appKernel = new AppKernel();

const App = (): React.ReactElement => {
  const [state, setState] = React.useState<{ flag: 'started' | 'loading' | 'failed'; error: null | Error }>({
    flag: 'loading',
    error: null,
  });

  const routerComponent = <Router {...routerProps} />;

  React.useEffect(() => {
    Bootstrap.init(
      'MONOlogz',
      appInfo,
      process.env.NODE_ENV !== 'development' ? appInfo.prodApiUrl : appInfo.devMobileApiUrl,
      appKernel,
      routerComponent,
      createStore,
      Loading,
      ErrorComponent,
    )
      .then(() => {
        setState({ flag: 'started', error: null });
      })
      .catch((err) => {
        console.warn(err.name);
        console.warn(err.message);
        console.warn(err.stack);
        setState({ flag: 'failed', error: err });
      });
  }, []);

  switch (true) {
    case state.flag === 'loading':
      return <Loading />;
    case state.flag === 'started':
      return <PaperProvider>{routerComponent}</PaperProvider>;
    case state.flag === 'failed':
      return <ErrorComponent error={state.error ? state.error : new Error('something went wrong')} />;
    default:
      throw new Error('unknown mobile init flag');
  }
};

export { App };
