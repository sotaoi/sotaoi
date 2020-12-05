import { Helper } from '@sotaoi/client/helper';
import { RouterEvents } from '@sotaoi/client/router/router-events';
import { Navigation } from '@sotaoi/client/router/navigation';
import { Actions as RouterActions } from 'react-native-router-flux';
import { store } from '@sotaoi/client/store';

class RouteChange {
  protected static currentPath: string[] = [];
  protected static routeScheme: string[] = [];

  public static pushRoute(to: string, goTop = true): void {
    this._setRoute(to, false, goTop);
  }

  public static replaceRoute(to: string, goTop = true): void {
    this._setRoute(to, true, goTop);
  }

  public static redirect(to: string): void {
    if (Helper.isMobile()) {
      if (RouterEvents.isRedirecting()) {
        return;
      }
      RouterEvents.redirect(to);
      return;
    }
    RouterEvents.redirect(to);
    !RouterEvents.getIsRunningConditions() && this.executeRedirect();
  }

  public static executeRedirect(): void {
    if (!RouterEvents.isRedirecting()) {
      console.warn('cannot execute redirect, no "redirectingTo"');
      RouterEvents.endRedirect();
      return;
    }
    const redirectTo = RouterEvents.getRedirectTo();
    if (!redirectTo) {
      console.warn('cannot get redirect to');
      RouterEvents.endRedirect();
      return;
    }
    RouterEvents.setExecuteRedirect();
    if (Helper.isWeb()) {
      window.history.replaceState(null, '', redirectTo);
      this.goToTop();
      Navigation.refresh();
      return;
    }
    if (Helper.isMobile()) {
      throw new Error('execute redirect - bad flow, this line should not have been reached');
    }
    throw new Error('execute redirect - unknown environment');
  }

  public static goToTop(): void {
    switch (true) {
      case Helper.isWeb():
        window.scrollTo({ top: 0 });
        break;
      case Helper.isMobile():
        // nothing here yet
        break;
      case Helper.isElectron():
        // nothing here yet
        break;
      default:
        throw new Error('unknown environment');
    }
  }

  //

  public static pushCurrentPath(newCurrentPath: string): void {
    this.currentPath.push(newCurrentPath);
    this.currentPathHook();
  }
  public static replaceCurrentPath(newCurrentPath: string): void {
    if (!this.currentPath.length) {
      this.currentPath.push(newCurrentPath);
      this.currentPathHook();
      return;
    }
    this.currentPath[this.currentPath.length - 1] = newCurrentPath;
    this.currentPathHook();
  }
  public static popCurrentPath(): boolean {
    const ok = this.currentPath.length > 1;
    ok && this.currentPath.pop();
    this.currentPathHook();
    return ok;
  }
  public static getCurrentPath(): string {
    if (!this.currentPath.length) {
      throw new Error('current path should have length by now, but it does not');
    }
    return this.currentPath[this.currentPath.length - 1];
  }

  public static pushRouteScheme(newRouteScheme: string): void {
    this.routeScheme.push(newRouteScheme);
  }
  public static replaceRouteScheme(newRouteScheme: string): void {
    if (!this.routeScheme.length) {
      this.routeScheme.push(newRouteScheme);
      return;
    }
    this.routeScheme[this.routeScheme.length - 1] = newRouteScheme;
  }
  public static popRouteScheme(): boolean {
    const ok = this.routeScheme.length > 1;
    ok && this.routeScheme.pop();
    return ok;
  }
  public static getRouteScheme(): null | string {
    const result = this.routeScheme[this.routeScheme.length - 1];
    return typeof result !== 'undefined' ? result : null;
  }
  public static getPrevRouteScheme(): null | string {
    const result = this.routeScheme[this.routeScheme.length - 2];
    return typeof result !== 'undefined' ? result : null;
  }

  //

  public static currentPathHook(): void {
    store().setCurrentPath(this.getCurrentPath());
  }

  protected static _setRoute(to: string, replace: boolean, goTop: boolean): void {
    if (Helper.isWeb()) {
      this.getCurrentPath() !== to && !replace
        ? window.history.pushState(null, '', to)
        : window.history.replaceState(null, '', to);
      goTop && this.goToTop();
      Navigation.refresh();
      return;
    }
    if (Helper.isMobile()) {
      const prevRouteScheme = this.getRouteScheme();
      const [routeMatch, routes] = Navigation.getRouteMatch(to);
      if (!replace) {
        this.pushRouteScheme(routeMatch);
        this.pushCurrentPath(to);
        if (prevRouteScheme === routeMatch) {
          Navigation.refresh();
          return;
        }
        RouterActions.push(routeMatch);
        return;
      }
      this.replaceRouteScheme(routeMatch);
      this.replaceCurrentPath(to);
      Navigation.refresh();
      return;
    }
    if (Helper.isElectron()) {
      throw new Error('electron not implemented');
    }
    throw new Error('push route - unknown environment');
  }

  //

  public static getPathname(): string {
    switch (true) {
      case Helper.isWeb():
        return window.location.pathname + window.location.hash;
      case Helper.isMobile():
        return store().getCurrentPath();
      case Helper.isElectron():
        // nothing yet
        return '/';
      default:
        throw new Error('unknown environment');
    }
  }
}

export { RouteChange };
