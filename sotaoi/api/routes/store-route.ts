import { Request, ServerRoute, ResponseToolkit, ResponseObject } from '@hapi/hapi';
import { payloadOptions } from '@sotaoi/api/routes/generic/payload-options';
import { ErrorResult } from '@sotaoi/omni/transactions';
import { Output } from '@sotaoi/api/output';
import { logger } from '@sotaoi/api/logger';

const storeRoute: ServerRoute = {
  method: 'POST',
  path: '/api/store',
  options: {
    payload: payloadOptions,
  },
  handler: async (request: Request, handler: ResponseToolkit): Promise<ResponseObject> => {
    try {
      const result = await Output.runCommand('store', request, handler, logger);
      return result;
    } catch (err) {
      logger().warn(err && err.stack ? err.stack : err);
      const code = 400;
      const error: ErrorResult = {
        code,
        title: err.name || 'Error',
        msg: err.message || 'Something went wrong',
        validations: null,
      };
      return handler.response(error).code(400);
    }
  },
};

export { storeRoute };
