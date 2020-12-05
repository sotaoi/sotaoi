import { Request, ServerRoute, ResponseToolkit, ResponseObject } from '@hapi/hapi';
import { payloadOptions } from '@sotaoi/api/routes/payload-options';
import { Seed, Lang } from '@sotaoi/omni/state';
import { ErrorResult } from '@sotaoi/omni/transactions';
import { AuthHandler } from '@sotaoi/api/commands/auth-handler';

const seedRoute: ServerRoute = {
  method: 'POST',
  path: '/api/seed',
  options: {
    payload: payloadOptions,
  },
  handler: async (request: Request, handler: ResponseToolkit): Promise<ResponseObject> => {
    try {
      const authRecord = await AuthHandler.translateAccessToken(
        handler,
        (request.payload as { [key: string]: any })?.accessToken || '',
      );
      const code = 200;
      const lang: Lang = {
        code: 'en',
        name: 'English',
      };
      const seed: Seed = {
        'app.meta.title': '',
        'app.credentials.authRecord': authRecord,
        'app.lang.selected': lang,
        'app.lang.default': lang,
        'app.lang.available': [lang],
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
