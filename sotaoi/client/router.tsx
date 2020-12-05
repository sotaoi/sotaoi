import React from 'react';
import { Helper } from '@sotaoi/client/helper';
import { RouteChange } from '@sotaoi/client/router/route-change';
import { RouterPropsConfig } from '@sotaoi/omni/state';
import { Navigation } from '@sotaoi/client/router/navigation';
import { WebComponent } from '@sotaoi/client/router/component/web.component';
import { MobileComponent } from '@sotaoi/client/router/component/mobile.component';
import { Store as ReduxStore } from 'redux';
import { ReactReduxContextValue } from 'react-redux';

interface RouterProps {
  config: RouterPropsConfig;
  errorComponent: React.FunctionComponent<{ error: Error }>;
  reduxStore?: ReduxStore<any, any>;
  reduxProviderContext?: React.Context<ReactReduxContextValue>;
}
const Router: React.FunctionComponent<RouterProps> = (props: RouterProps) => {
  Navigation.init(
    props.config,
    props.errorComponent,
    props.reduxStore || undefined,
    props.reduxProviderContext || undefined,
  );
  RouteChange.replaceCurrentPath(RouteChange.getPathname());

  if (Helper.isWeb()) {
    return <WebComponent />;
  }

  if (Helper.isMobile()) {
    return <MobileComponent />;
  }

  if (Helper.isElectron()) {
    throw new Error('electron is not yet implemented');
  }

  throw new Error('something went wrong in router. unknown environment');
};

const pushRoute = (to: string, goTop = true): void => {
  return RouteChange.pushRoute(to, goTop);
};

const replaceRoute = (to: string, goTop = true): void => {
  return RouteChange.replaceRoute(to, goTop);
};

const redirect = (to: string): void => {
  RouteChange.redirect(to);
};

export { Router, pushRoute, replaceRoute, redirect };
export { Link } from '@sotaoi/client/router/link';
export type { RouterProps };
export type { LayoutProps } from '@sotaoi/omni/state';
