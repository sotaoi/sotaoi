import { RetrieveHandler } from '@sotaoi/api/queries/retrieve-handler';
import { RetrieveResult } from '@sotaoi/omni/transactions';
import { Retrieve } from '@sotaoi/omni/transactions';
import { db } from '@sotaoi/api/db';

class UserRetrieve extends RetrieveHandler {
  public async handle(retrieve: Retrieve): Promise<RetrieveResult> {
    try {
      const user = await db('user').where('uuid', retrieve.uuid).first();
      delete user.password;
      user.address = await db('address').where('uuid', JSON.parse(user.address).uuid).first();
      if (!user.address) {
        throw new Error('failed to fetch address for user');
      }
      if (!user) {
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
          record: user,
        },
        null,
      );
    } catch (err) {
      return new RetrieveResult(false, null, {
        code: 400,
        title: err && err.name ? err.name : 'Error',
        msg: err && err.message ? err.message : 'Retrieve failed',
        validations: null,
      });
    }
  }
}

export { UserRetrieve };
