import { RetrieveHandler } from '@sotaoi/api/queries/retrieve-handler';
import { RetrieveResult } from '@sotaoi/omni/transactions';
import { Retrieve } from '@sotaoi/omni/transactions';
import { GenericModel } from '@sotaoi/api/db/generic-model';
import { Record } from '@sotaoi/omni/artifacts';
import { logger } from '@sotaoi/api/logger';

class CategoryRetrieve extends RetrieveHandler {
  public async model(): Promise<GenericModel> {
    return new GenericModel('category');
  }
  public async handle(retrieve: Retrieve): Promise<RetrieveResult> {
    try {
      const category = new GenericModel('category').db().findOne({ uuid: retrieve.uuid }).lean();
      if (!category) {
        const error = new Error('Retrieve failed');
        error.message = 'Not found';
        throw error;
      }
      return new RetrieveResult(
        200,
        'Retrieve success',
        'Retrieve was successful',
        await this.transform(Record.make(category), null),
        null,
      );
    } catch (err) {
      logger().error(err && err.stack ? err.stack : err);
      return new RetrieveResult(400, 'Error', 'Retrieve failed', null, null);
    }
  }
}

export { CategoryRetrieve };
