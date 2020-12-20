import { RetrieveHandler } from '@sotaoi/api/queries/retrieve-handler';
import { RetrieveResult } from '@sotaoi/omni/transactions';
import { Retrieve } from '@sotaoi/omni/transactions';
import { db } from '@sotaoi/api/db';

class CategoryRetrieve extends RetrieveHandler {
  public async handle(retrieve: Retrieve): Promise<RetrieveResult> {
    try {
      const category = await db('category').where('uuid', retrieve.uuid).first();
      if (!category) {
        const error = new Error('Retrieve failed');
        error.message = 'Not found';
        throw error;
      }
      return new RetrieveResult(
        true,
        {
          code: 200,
          title: 'Retrieve success',
          msg: 'Retrieve was successful',
          record: category,
        },
        null,
      );
    } catch (err) {
      return new RetrieveResult(false, null, {
        code: 400,
        title: 'Error',
        msg: 'Retrieve failed',
        validations: null,
      });
    }
  }
}

export { CategoryRetrieve };
