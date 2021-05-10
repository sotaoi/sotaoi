import React from 'react';
import { Helper } from '@sotaoi/client/helper';
import { RouteChange } from '@sotaoi/client/router/route-change';
import { LayoutProps, RouterPropsConfig } from '@sotaoi/omni/state';
import { Navigation } from '@sotaoi/client/router/navigation';
import { WebComponent } from '@sotaoi/client/router/component/web.component';
import { MobileComponent } from '@sotaoi/client/router/component/mobile.component';
import { Store as ReduxStore } from 'redux';
import { ReactReduxContextValue } from 'react-redux';
import { controlPanel } from '@sotaoi/client/control-panel';
import { ErrorComponent } from '@sotaoi/client/control-panel/components/generic/error-component';
import { InstallLayout } from '@sotaoi/client/control-panel/components/install-layout/install-layout';
import { InstallForm } from '@sotaoi/client/control-panel/components/install-layout/forms/install-form';

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

const routes = (controlPanelPrefix: string, routes: RouterProps): RouterProps => {
  if (process.env.installed !== 'yes') {
    routes = {
      config: {
        install: {
          prefix: '/',
          layout: InstallLayout,
          routes: {
            '/': () => {
              return <InstallForm />;
            },
          },
          condition: () => true,
        },
      },
      errorComponent: ErrorComponent,
    };
    return routes;
  }

  const camelizedControlPanelPrefix = Helper.camelizeKebab(controlPanelPrefix);
  controlPanelPrefix.charAt(0) !== '/' && (controlPanelPrefix = '/' + controlPanelPrefix);
  controlPanelPrefix.charAt(controlPanelPrefix.length - 1) === '/' &&
    (controlPanelPrefix = controlPanelPrefix.substr(0, controlPanelPrefix.length - 1));

  routes.config[camelizedControlPanelPrefix] = {
    prefix: controlPanelPrefix,
    layout: (props: LayoutProps): null | React.ReactElement => controlPanel().getControlPanelLayout(props),
    routes: {
      '/': (props: { [key: string]: any }): null | React.ReactElement => {
        return controlPanel().getControlPanelAuthComponent(props);
      },
    },
    condition: (): boolean => {
      return Helper.isWeb();
    },
  };

  return routes;
};

export { Router, pushRoute, replaceRoute, redirect, routes };
export { Link } from '@sotaoi/client/router/link';
export type { RouterProps };
export type { LayoutProps } from '@sotaoi/omni/state';
