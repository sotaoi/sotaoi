import { Request, ServerRoute, ResponseToolkit, ResponseObject } from '@hapi/hapi';
import { storage, Drives } from '@sotaoi/api/storage';
import { logger } from '@sotaoi/api/logger';

const storageRoute: ServerRoute = {
  method: 'GET',
  path: '/api/storage/{drive}/{role}/{domain}/{group}/{division}/{pathname*}',
  handler: async (request: Request, handler: ResponseToolkit): Promise<ResponseObject> => {
    try {
      return await storage(request.params.drive as Drives).read(handler, request.params.role, {
        domain: request.params.domain,
        group: request.params.group,
        division: request.params.division,
        pathname: request.params.pathname,
      });
    } catch (err) {
      logger().error(err && err.stack ? err.stack : err);
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
