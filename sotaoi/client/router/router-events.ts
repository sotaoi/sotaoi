import { Helper } from '@sotaoi/client/helper';

const log = console.log;

class RouterEvents {
  public static listeners: { [key: string]: { [key: string]: () => void } } = {};
  protected static redirectingTo: false | string = false;
  protected static executingRedirect = false;
  protected static isRunningConditions = false;

  public static listen(event: string, callback: () => void): () => void {
    typeof this.listeners[event] === 'undefined' && (this.listeners[event] = {});

    const id = Helper.uuid();
    this.listeners[event][id] = callback;

    return (): void => {
      delete this.listeners[event][id];
    };
  }

  public static fire(event: string): void {
    if (typeof this.listeners[event] === 'undefined') {
      log(`no listeners for event "${event}"`);
      return;
    }

    const callbacks = Object.values(this.listeners[event]);
    callbacks.map((callback) => callback());
  }

  public static redirect(to: string): void {
    if (this.redirectingTo || this.executingRedirect) {
      return;
    }
    this.redirectingTo = to;
    this.executingRedirect = false;
  }

  public static setExecuteRedirect(): void {
    this.executingRedirect = true;
  }

  public static getRedirectTo(): false | string {
    return this.redirectingTo;
  }

  public static endRedirect(): void {
    this.redirectingTo = false;
    this.executingRedirect = false;
  }

  public static isRedirecting(): boolean {
    return this.redirectingTo !== false;
  }

  public static isExecutingRedirect(): boolean {
    return this.executingRedirect;
  }

  public static setIsRunningConditions(flag: boolean): void {
    this.isRunningConditions = flag;
  }

  public static getIsRunningConditions(): boolean {
    return this.isRunningConditions;
  }
}

export { RouterEvents };
