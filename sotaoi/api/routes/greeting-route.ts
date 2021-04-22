import { Request, ServerRoute, ResponseToolkit, ResponseObject } from '@hapi/hapi';
import { MsgResult } from '@sotaoi/omni/transactions';

const greetingRoute: ServerRoute = {
  method: 'GET',
  path: '/api',
  handler: async (request: Request, handler: ResponseToolkit): Promise<ResponseObject> => {
    const result = new MsgResult<ResponseObject>(200, 'Greetings', 'Hello API base').output(handler);
    return result;
  },
};

export { greetingRoute };
