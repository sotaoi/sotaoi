import { Request, ServerRoute, ResponseToolkit, ResponseObject } from '@hapi/hapi';
import { storage } from '@sotaoi/api/storage';
import { logger } from '@sotaoi/api/logger';
import { disconnect } from '@sotaoi/api/db';

const storageRoute: ServerRoute = {
  method: 'GET',
  path: '/api/storage/{drive}/{role}/{dap*}',
  handler: async (request: Request, handler: ResponseToolkit): Promise<ResponseObject> => {
    try {
      const dapSplit = request.params.dap.split('/');
      const domain = dapSplit.shift();
      const pathname = dapSplit.join('/');
      if (!domain || !pathname) {
        throw new Error('something went wrong');
      }
      const result = await storage(request.params.drive).read(handler, request.params.role, {
        domain,
        pathname,
      });
      await disconnect();
      return result;
    } catch (err) {
      logger().error(err && err.stack ? err.stack : err);
      await disconnect();
      return handler
        .response({
          statusCode: 404,
          error: 'Not Found',
          message: 'Not Found',
        })
        .code(404);
    }
  },
};

export { storageRoute };
