import { Request, ServerRoute, ResponseToolkit, ResponseObject } from '@hapi/hapi';
import { ErrorResult } from '@sotaoi/omni/transactions';
import { storage } from '@sotaoi/api/storage';

const storageRoute: ServerRoute = {
  method: 'GET',
  path: '/api/storage/{role}/{pathname*}',
  handler: async (request: Request, handler: ResponseToolkit): Promise<ResponseObject> => {
    try {
      return await storage().read(request.params.pathname, request.params.role, handler);
    } catch (err) {
      // todo here: replace with hapi 404 not found standard message (to not give more info than necessary)
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

export { storageRoute };
