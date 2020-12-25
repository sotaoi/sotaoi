import React from 'react';
import { RouteChange } from '@sotaoi/client/router/route-change';
import { RouterEvents } from '@sotaoi/client/router/router-events';
import { Errors } from '@sotaoi/omni/errors';
import { LayoutProps } from '@sotaoi/omni/state';
import { Navigation } from '@sotaoi/client/router/navigation';
import { Provider } from 'react-redux';

let routerRefreshListener: false | (() => void) = false;

const WebComponent = (): null | React.ReactElement => {
  let layoutMatches: number;
  let Layout: null | React.FunctionComponent<LayoutProps> = null;

  const config = Navigation.config;
  const ErrorComponent = Navigation.ErrorComponent;
  const [, setState] = React.useState();
  const forceUpdate = React.useCallback(() => setState({}), []);

  routerRefreshListener && routerRefreshListener();
  routerRefreshListener = RouterEvents.listen('router-refresh', () => {
    RouteChange.replaceCurrentPath(RouteChange.getPathname());
    forceUpdate();
  });
  React.useEffect(() => {
    window.onpopstate = (): void => Navigation.refresh();
    window.onhashchange = (): void => Navigation.refresh();
    return (): void => {
      routerRefreshListener && routerRefreshListener();
    };
  }, []);

  layoutMatches = 0;
  for (const [layoutName, layoutConfig] of Object.entries(config)) {
    RouterEvents.setIsRunningConditions(true);
    if (!layoutConfig.condition()) {
      RouterEvents.setIsRunningConditions(false);
      continue;
    }
    RouterEvents.setIsRunningConditions(false);

    if (
      !layoutConfig.prefix ||
      layoutConfig.prefix === '/' ||
      (layoutConfig.prefix.charAt(0) === '/'
        ? layoutConfig.prefix === RouteChange.getPathname().substr(0, layoutConfig.prefix.length)
        : `/${layoutConfig.prefix}` === RouteChange.getPathname().substr(0, layoutConfig.prefix.length + 1))
    ) {
      layoutMatches++;
    }
    Layout = layoutConfig.layout;

    for (let [routeScheme, RouteComponent] of Object.entries(layoutConfig.routes)) {
      routeScheme = Navigation.parseRouteScheme(layoutName, layoutConfig.prefix, routeScheme);
      if (!Navigation.isMatch(layoutName, RouteChange.getCurrentPath(), routeScheme)) {
        continue;
      }
      RouterEvents.isRedirecting() && RouterEvents.endRedirect();
      RouteChange.replaceRouteScheme(routeScheme);

      if (!Navigation.reduxStore) {
        return (
          <Layout>
            <RouteComponent />
          </Layout>
        );
      }
      return (
        <Provider store={Navigation.reduxStore} context={Navigation.reduxProviderContext}>
          <Layout>
            <RouteComponent />
          </Layout>
        </Provider>
      );
    }
  }

  RouterEvents.isExecutingRedirect() && RouterEvents.endRedirect();

  if (RouterEvents.isRedirecting()) {
    RouteChange.executeRedirect();
    return null;
  }

  if (layoutMatches !== 1 || !Layout) {
    return <ErrorComponent error={new Errors.NotFoundLayout()} />;
  }

  return (
    <Layout>
      <ErrorComponent error={new Errors.NotFoundView()} />
    </Layout>
  );
};

export { WebComponent };
