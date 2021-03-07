import React from 'react';
import '@app/client/css/app.css';
import '@app/client/css/style.css';
import { Router } from '@sotaoi/client/router';
import { Bootstrap } from '@sotaoi/client/bootstrap';
import { createStore } from 'redux';
import { routerProps } from '@app/client/router-props';
import { Loading } from '@app/client/components/loading';
import { ErrorComponent } from '@app/client/components/error-component';
import { getAppInfo } from '@app/omni/get-app-info';
import { AppKernel } from '@sotaoi/client/app-kernel';

const appInfo = getAppInfo();

const main = async (): Promise<void> => {
  const appKernel = new AppKernel();
  const routerComponent = <Router {...routerProps} />;
  Bootstrap.init(
    'MONOlogz',
    appInfo,
    process.env.NODE_ENV !== 'development' ? appInfo.prodApiUrl : appInfo.devApiUrl,
    appKernel,
    routerComponent,
    createStore,
    Loading,
    ErrorComponent,
  );
};

main();
