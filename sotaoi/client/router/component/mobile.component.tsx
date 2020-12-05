import React from 'react';
import { RouteChange } from '@sotaoi/client/router/route-change';
import { RouterEvents } from '@sotaoi/client/router/router-events';
import { Navigation, Routes } from '@sotaoi/client/router/navigation';
import { Router as RnRouter, Stack, Scene, Actions as RouterActions } from 'react-native-router-flux';
import { BackHandler } from 'react-native';
import { Provider } from 'react-redux';

let forceUpdate: () => void = () => undefined;
let routes: Routes = {
  routeMatch: null,
  layoutMatch: null,
  items: {},
};

const MobileComponent = (): null | React.ReactElement => {
  routes = Navigation.getRouteMatch(RouteChange.getCurrentPath())[1];

  React.useEffect((): (() => void) => {
    const backHandler = (): true => {
      const prevRouteScheme = RouteChange.getPrevRouteScheme();
      const currentRouteScheme = RouteChange.getRouteScheme();
      const popped = RouteChange.popCurrentPath();
      if (popped && prevRouteScheme) {
        RouteChange.popRouteScheme();
        if (prevRouteScheme === currentRouteScheme) {
          forceUpdate();
          return true;
        }
        RouterActions.pop();
      }
      return true;
    };
    BackHandler.addEventListener('hardwareBackPress', backHandler);

    const routerRefreshListener = RouterEvents.listen('router-refresh', () => {
      const to = RouterEvents.getRedirectTo() || RouteChange.getCurrentPath();
      const [routeMatch, routes] = Navigation.getRouteMatch(to);
      RouterEvents.endRedirect();
      RouteChange.replaceCurrentPath(to);
      RouteChange.replaceRouteScheme(routeMatch);
      routeMatch !== RouteChange.getPrevRouteScheme() ? RouterActions.replace(routeMatch) : forceUpdate();
    });
    return (): void => {
      BackHandler.removeEventListener('hardwareBackPress', backHandler);
      routerRefreshListener();
    };
  }, []);

  if (!RouteChange.getRouteScheme()) {
    const [routeMatch] = Navigation.getRouteMatch(RouteChange.getCurrentPath());
    RouteChange.replaceRouteScheme(routeMatch);
  }

  const Component = (props: {
    render: React.FunctionComponent<any> | React.ComponentClass<any, any>;
  }): null | React.ReactElement => {
    const currentRouteScheme = RouteChange.getRouteScheme();
    if (!currentRouteScheme) {
      throw new Error('router mobile component error: route scheme failed');
    }
    const [, setState] = React.useState();
    forceUpdate = React.useCallback(() => setState({}), []);
    RouterEvents.isRedirecting() && RouterEvents.endRedirect();

    React.useEffect(() => {
      return (): void => {
        forceUpdate = (): void => undefined;
      };
    }, []);

    const Render = props.render;

    if (!Navigation.reduxStore) {
      return <Render />;
    }
    return (
      <Provider store={Navigation.reduxStore} context={Navigation.reduxProviderContext}>
        <Render />;
      </Provider>
    );
  };

  return (
    <RnRouter>
      <Stack key={'root'} hideNavBar={true} titleStyle={{ fontSize: 14 }}>
        {Object.values(routes.items).map((item) => (
          <Scene
            key={item.scheme}
            initial={item.scheme === RouteChange.getRouteScheme()}
            component={(): null | React.ReactElement => <Component render={item.component} />}
          />
        ))}
      </Stack>
    </RnRouter>
  );
};

export { MobileComponent };
