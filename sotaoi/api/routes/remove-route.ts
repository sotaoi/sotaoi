import { Request, ServerRoute, ResponseToolkit, ResponseObject } from '@hapi/hapi';
import { payloadOptions } from '@sotaoi/api/routes/payload-options';
import { ErrorResult } from '@sotaoi/omni/transactions';

const removeRoute: ServerRoute = {
  method: 'POST',
  path: '/api/remove',
  options: {
    payload: payloadOptions,
  },
  handler: async (request: Request, handler: ResponseToolkit): Promise<ResponseObject> => {
    try {
      const code = 200;
      return handler.response({}).code(code);
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
