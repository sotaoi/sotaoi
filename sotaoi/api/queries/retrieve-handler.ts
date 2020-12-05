import { RetrieveResult } from '@sotaoi/omni/transactions';
import { Retrieve } from '@sotaoi/omni/transactions';

abstract class RetrieveHandler {
  abstract handle(retrieve: Retrieve): Promise<RetrieveResult>;
}

export { RetrieveHandler };
