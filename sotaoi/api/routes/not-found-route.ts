import { Request, ServerRoute, ResponseToolkit, ResponseObject } from '@hapi/hapi';
import { ErrorResult } from '@sotaoi/omni/transactions';
import { disconnect } from '@sotaoi/api/db';

const notFoundRoute: ServerRoute = {
  method: ['POST', 'PUT', 'PATCH', 'DELETE'],
  path: '/{any*}',
  handler: async (request: Request, handler: ResponseToolkit): Promise<ResponseObject> => {
    const code = 404;
    const error: ErrorResult = {
      code,
      title: 'Not found',
      msg: 'We did not find what you were looking for',
      validations: null,
    };
    await disconnect();
    return handler.response(error).code(code);
  },
};

export { notFoundRoute };
