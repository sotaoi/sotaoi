import { Request, ServerRoute, ResponseToolkit, ResponseObject } from '@hapi/hapi';
import { payloadOptions } from '@sotaoi/api/routes/payload-options';
import { ErrorResult } from '@sotaoi/omni/transactions';
import { Output } from '@sotaoi/api/output';
import { logger } from '@sotaoi/api/logger';
import { disconnect } from '@sotaoi/api/db';

const queryRoute: ServerRoute = {
  method: 'POST',
  path: '/api/query',
  options: {
    payload: payloadOptions,
  },
  handler: async (request: Request, handler: ResponseToolkit): Promise<ResponseObject> => {
    try {
      const result = await Output.runQuery(request, handler, logger);
      await disconnect();
      return result;
    } catch (err) {
      const code = 400;
      const error: ErrorResult = {
        code,
        title: err.name || 'Error',
        msg: err.message || 'Something went wrong',
        validations: null,
      };
      await disconnect();
      return handler.response(error).code(400);
    }
  },
};

export { queryRoute };
