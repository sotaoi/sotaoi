import fs from 'fs';
import { Request, ServerRoute, ResponseToolkit, ResponseObject } from '@hapi/hapi';
import { Helper } from '@sotaoi/api/helper';

const renderWebRoute: ServerRoute = {
  method: 'GET',
  path: '/{path*}',
  handler: async (request: Request, handler: ResponseToolkit): Promise<ResponseObject> => {
    if (
      (!request.params.path || !fs.existsSync(Helper.getPublicPath(request.params.path))) &&
      fs.existsSync(Helper.getPublicPath('index.html'))
    ) {
      return handler.file('index.html');
    }
    return handler.file(request.params.path);
  },
};

export { renderWebRoute };
