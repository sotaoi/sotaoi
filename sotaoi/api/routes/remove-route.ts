import { Request, ServerRoute, ResponseToolkit, ResponseObject } from '@hapi/hapi';
import { payloadOptions } from '@sotaoi/api/routes/payload-options';
import { ErrorResult } from '@sotaoi/omni/transactions';
import { Output } from '@sotaoi/api/output';
import { logger } from '@sotaoi/api/logger';

const removeRoute: ServerRoute = {
  method: 'POST',
  path: '/api/remove',
  options: {
    payload: payloadOptions,
  },
  handler: async (request: Request, handler: ResponseToolkit): Promise<ResponseObject> => {
    try {
      return await Output.runCommand('remove', request, handler, logger);
    } catch (err) {
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

export { removeRoute };
