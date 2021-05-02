import React from 'react';
import '@app/client/components/generic/css/app.css';
import '@app/client/components/generic/css/style.css';
import { Router } from '@sotaoi/client/router';
import { Bootstrap } from '@sotaoi/client/bootstrap';
import { createStore } from 'redux';
import { routerProps } from '@app/client/routes';
import { Loading } from '@app/client/components/generic/loading';
import { ErrorComponent } from '@app/client/components/generic/error-component';
import { getAppInfo, getAppDomain } from '@app/omni/get-app-info';
import { AppKernel } from '@sotaoi/client/app-kernel';

const appInfo = getAppInfo();
const domain = getAppDomain();

const main = async (): Promise<void> => {
  const appKernel = new AppKernel();
  const routerComponent = <Router {...routerProps} />;
  Bootstrap.init(
    appInfo.name,
    appInfo,
    `https://${domain}/api`,
    appKernel,
    routerComponent,
    createStore,
    Loading,
    ErrorComponent,
    true,
  );
};

main();
