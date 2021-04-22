import { Request, ServerRoute, ResponseToolkit, ResponseObject } from '@hapi/hapi';
import { Seed } from '@sotaoi/omni/state';
import { ErrorResult } from '@sotaoi/omni/transactions';
import { AuthHandler } from '@sotaoi/api/commands/auth-handler';
import { lang } from '@sotaoi/api/lang';

const seedRoute: ServerRoute = {
  method: 'GET',
  path: '/api/seed',
  handler: async (request: Request, handler: ResponseToolkit): Promise<ResponseObject> => {
    try {
      const [authRecord, accessToken] = await AuthHandler.translateAccessToken(
        handler,
        AuthHandler.getAccessToken(handler),
      );
      const code = 200;
      const seed: Seed = {
        'app.meta.title': '',
        'app.credentials.accessToken': accessToken,
        'app.credentials.authRecord': authRecord,
        ...(await lang().getLangData()),
      };
      return handler.response(seed).code(code);
    } catch (err) {
      const code = 400;
      const error: ErrorResult = {
        code,
        title: err.name || '',
        msg: err.message,
        validations: null,
      };
      return handler.response(error).code(400);
    }
  },
};

export { seedRoute };
