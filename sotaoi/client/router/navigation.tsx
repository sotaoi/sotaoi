import React from 'react';
import { RouterPropsConfig } from '@sotaoi/omni/state';
import { Errors } from '@sotaoi/client/errors';
import { RouterEvents } from '@sotaoi/client/router/router-events';
import { RouteChange } from '@sotaoi/client/router/route-change';
import { Helper } from '@sotaoi/client/helper';
import { store } from '@sotaoi/client/store';
import { Store as ReduxStore } from 'redux';
import { ReactReduxContextValue } from 'react-redux';

interface Routes {
  routeMatch: null | string;
  layoutMatch: null | string;
  items: {
    [key: string]: {
      scheme: string;
      component: React.FunctionComponent<any> | React.ComponentClass<any, any>;
    };
  };
}

class RouterData {
  public static config: null | RouterPropsConfig = null;
  public static errorComponent: null | React.FunctionComponent<{ error: Error }> = null;
}

class Navigation {
  public static readonly NOT_FOUND_LAYOUT_SCHEME = '_@_{not-found-layout}-scheme';
  public static config: RouterPropsConfig;
  public static ErrorComponent: React.FunctionComponent<{ error: Error }>;
  public static reduxStore: undefined | ReduxStore<any, any>;
  public static reduxProviderContext: undefined | React.Context<ReactReduxContextValue>;

  public static init(
    config: RouterPropsConfig,
    ErrorComponent: React.FunctionComponent<{ error: Error }>,
    reduxStore?: ReduxStore<any, any>,
    reduxProviderContext?: React.Context<ReactReduxContextValue>,
  ): void {
    this.config = config;
    this.ErrorComponent = ErrorComponent;
    this.reduxStore = reduxStore;
    this.reduxProviderContext = reduxProviderContext;
  }

  public static getNotFoundViewScheme(layoutName: string): string {
    return `_@_{not-found-view}-${layoutName}-scheme`;
  }

  public static getRouteMatch(path: string): [string, Routes] {
    if (!this.config || !this.ErrorComponent) {
      throw new Error('something went wrong - router is not properly initialized');
    }
    const routes = this.getRoutes(path, this.config, this.ErrorComponent);
    const routeMatch = routes.routeMatch
      ? routes.routeMatch
      : !routes.layoutMatch
      ? this.NOT_FOUND_LAYOUT_SCHEME
      : this.getNotFoundViewScheme(routes.layoutMatch);
    return [routeMatch, routes];
  }

  public static getRoutes(
    currentPath: string,
    config: RouterPropsConfig,
    errorComponent: React.FunctionComponent<{ error: Error }>,
  ): Routes {
    RouterData.config = config;
    RouterData.errorComponent = errorComponent;

    const ErrorComponent = RouterData.errorComponent;
    const notFoundLayoutScheme = this.NOT_FOUND_LAYOUT_SCHEME;
    const NotFoundLayoutComponent = (): React.ReactElement => {
      return <ErrorComponent error={new Errors.NotFoundLayout()} />;
    };
    const routes: Routes = {
      routeMatch: null,
      layoutMatch: null,
      items: {
        [notFoundLayoutScheme]: {
          scheme: notFoundLayoutScheme,
          component: NotFoundLayoutComponent,
        },
      },
    };

    for (const [layoutName, layoutConfig] of Object.entries(RouterData.config)) {
      const notFoundViewScheme = this.getNotFoundViewScheme(layoutName);
      const Layout = layoutConfig.layout;
      const NotFoundViewComponent = (): React.ReactElement => {
        return (
          <Layout>
            <ErrorComponent error={new Errors.NotFoundView()} />
          </Layout>
        );
      };
      routes.items[notFoundViewScheme] = {
        scheme: notFoundViewScheme,
        component: NotFoundViewComponent,
      };
      for (let [routeScheme, Component] of Object.entries(layoutConfig.routes)) {
        routeScheme = this.parseRouteScheme(layoutName, layoutConfig.prefix, routeScheme);
        routes.items[routeScheme] = {
          scheme: routeScheme,
          component: (): React.ReactElement => {
            const state = store().getState();
            const params = this.getParams();
            return (
              <Layout>
                <Component state={state} params={params} />
              </Layout>
            );
          },
        };

        if (routes.routeMatch || !layoutConfig.condition()) {
          continue;
        }
        routes.layoutMatch = layoutName;
        this.isMatch(layoutName, currentPath, routeScheme) && (routes.routeMatch = routeScheme);
      }
    }

    routes.routeMatch && RouterEvents.endRedirect();

    return routes;
  }

  public static isMatch(layoutName: string, uri: string, routeScheme: string): boolean {
    uri = layoutName + '-' + uri;

    let argMatches: null | RegExpMatchArray;

    uri = uri.split('#')[0];

    try {
      argMatches = routeScheme.match(/{[^({}).]+}/g);
    } catch (ex) {
      return false;
    }
    const args = argMatches ? argMatches.map((routeScheme) => routeScheme.replace(/[{}]/g, '')) : [];

    let regex = `^${routeScheme}$`;
    args.map((arg) => {
      // this below is cool. route example: "/Items/NewsMessages(/{displayArea})?(/{remainingUri})??"
      // this will result in params like: {displayArea: "tariffAreaOrWhatever", remainingUri: "lang/en/exclusive/true/any/other/params"}
      // so "??" in the end can put everything else in a param
      // similar to the "exact=true/false" strategy on classic react routers
      regex = regex.replace(`(/{${arg}})??`, '(/(.+))?');

      regex = regex.replace(`(/{${arg}})?`, '(/([^/]+))?');
      regex = regex.replace(`{${arg}}`, '([^/]+)');
    });

    let match: null | RegExpMatchArray;
    try {
      match = uri.match(regex);
    } catch (ex) {
      return false;
    }
    return !!match;
  }

  public static parseRouteScheme(layoutName: string, prefix: string, routeScheme: string): string {
    const ignorePrefix = routeScheme.charAt(0) === '!' && !!(routeScheme = routeScheme.substr(1));
    prefix.charAt(0) !== '/' && (prefix = `/${prefix}`);
    routeScheme.charAt(0) !== '/' && (routeScheme = `/${routeScheme}`);
    routeScheme = ignorePrefix ? routeScheme : prefix + routeScheme;
    // todo here: fix this
    routeScheme.charAt(0) === '/' && routeScheme.charAt(1) === '/' && (routeScheme = routeScheme.substr(1));
    return layoutName + '-' + routeScheme;
  }

  public static refresh(): void {
    if (Helper.isWeb()) {
      RouterEvents.fire('router-refresh');
      return;
    }
    if (Helper.isMobile()) {
      this.getRouteMatch(RouteChange.getCurrentPath());
      RouterEvents.fire('router-refresh');
      return;
    }
    if (Helper.isElectron()) {
      throw new Error('router navigation error: electron is not implemented');
    }
    throw new Error('router navigation error: unknown environment');
  }

  public static getParams<ParamsType extends { [key: string]: any }>(): ParamsType {
    let argMatches: null | RegExpMatchArray;
    let currentPath = RouteChange.getCurrentPath();
    const routeScheme = RouteChange.getRouteScheme();
    if (!routeScheme) {
      return {} as ParamsType;
    }
    const layoutName = routeScheme.split('-')[0];
    currentPath = `${layoutName}-${currentPath}`;

    try {
      argMatches = routeScheme.match(/{[^({}).]+}/g);
    } catch (ex) {
      return {} as ParamsType;
    }
    const args = argMatches ? argMatches.map((routeScheme) => routeScheme.replace(/[{}]/g, '')) : [];

    let regex = `^${routeScheme}$`;
    args.map((arg) => {
      regex = regex.replace(`(/{${arg}})??`, '(/(.+))?');
      regex = regex.replace(`(/{${arg}})?`, '(/([^/]+))?');
      regex = regex.replace(`{${arg}}`, '([^/]+)');
    });

    const params: { [key: string]: any } = {};

    let index = -1;
    const result: string[] = [];
    let match: null | RegExpMatchArray;
    try {
      match = currentPath.match(regex);
    } catch (ex) {
      return {} as ParamsType;
    }
    match &&
      match.map((match) => {
        index++;
        if (index > 0 && match && match[0] !== '/') {
          result.push(match);
        }
      });

    index = -1;
    for (const item of args) {
      index++;
      params[item] = result && result[index] ? result[index] : null;
    }

    return (params || {}) as ParamsType;
  }
}

export { Navigation };
export type { Routes };
