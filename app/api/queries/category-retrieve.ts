import { RetrieveHandler } from '@sotaoi/api/queries/retrieve-handler';
import { RetrieveResult } from '@sotaoi/omni/transactions';
import { Retrieve } from '@sotaoi/omni/transactions';
import { db } from '@sotaoi/api/db';
import { GenericModel } from '@sotaoi/api/models/generic-model';

class CategoryRetrieve extends RetrieveHandler {
  public async model(): Promise<GenericModel> {
    return new GenericModel('category');
  }
  public async handle(retrieve: Retrieve): Promise<RetrieveResult> {
    try {
      const category = await db('category').where('uuid', retrieve.uuid).first();
      if (!category) {
        const error = new Error('Retrieve failed');
        error.message = 'Not found';
        throw error;
      }
      return new RetrieveResult(
        200,
        'Retrieve success',
        'Retrieve was successful',
        await this.transform(category, null),
        null,
      );
    } catch (err) {
      return new RetrieveResult(400, 'Error', 'Retrieve failed', null, null);
    }
  }
}

export { CategoryRetrieve };
