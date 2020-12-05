import { AuthResult } from '@sotaoi/omni/transactions';
import { AuthCommand } from '@sotaoi/api/commands';
import { AuthRecord } from '@sotaoi/omni/artifacts';
import { BaseHandler } from '@sotaoi/api/base-handler';
import { ResponseToolkit } from '@hapi/hapi';

// todo here: rename user column to something abstract
// todo here: add strategy to translate access token (auth registry)

abstract class AuthHandler extends BaseHandler {
  abstract async getFormId(): Promise<string>;
  abstract async handle(command: AuthCommand): Promise<AuthResult>;

  protected static _translateAccessToken = async (
    handler: ResponseToolkit,
    accessToken: string,
  ): Promise<null | AuthRecord> => null;

  public saveAccessToken(value: string): void {
    this.handler.state('accessToken', value);
  }

  public getAccessToken(): null | string {
    return this.handler.request.state.accessToken || null;
  }

  public static getAccessToken(handler: ResponseToolkit): string {
    return handler.request.state.accessToken || '';
  }

  public static setTranslateAccessToken(
    translateAccessTokenFn: (handler: ResponseToolkit, accessToken: string) => Promise<null | AuthRecord>,
  ): void {
    this._translateAccessToken = translateAccessTokenFn;
  }

  public static async translateAccessToken(handler: ResponseToolkit, accessToken: string): Promise<null | AuthRecord> {
    return await this._translateAccessToken(handler, accessToken);
  }
}

export { AuthHandler };
