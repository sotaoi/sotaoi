import { Request, ServerRoute, ResponseToolkit, ResponseObject } from '@hapi/hapi';
import { payloadOptions } from '@sotaoi/api/routes/payload-options';
import { ErrorResult } from '@sotaoi/omni/transactions';
import { logger } from '@sotaoi/api/logger';
import { AuthHandler } from '@sotaoi/api/commands/auth-handler';
import { disconnect } from '@sotaoi/api/db';

const deauthRoute: ServerRoute = {
  method: 'DELETE',
  path: '/api/auth',
  options: {
    payload: payloadOptions,
  },
  handler: async (request: Request, handler: ResponseToolkit): Promise<ResponseObject> => {
    try {
      await AuthHandler.deauth(handler);
      await disconnect();
      return handler.response({ ok: true });
    } catch (err) {
      const code = 400;
      const error: ErrorResult = {
        code,
        title: err.name || 'Error',
        msg: err.message || 'Something went wrong',
        validations: null,
      };
      logger().error(error);
      await disconnect();
      return handler.response(error).code(400);
    }
  },
};

export { deauthRoute };
