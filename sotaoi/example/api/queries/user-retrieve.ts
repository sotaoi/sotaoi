import { RetrieveHandler } from '@sotaoi/api/queries/retrieve-handler';
import { RetrieveResult } from '@sotaoi/omni/transactions';
import { Retrieve } from '@sotaoi/omni/transactions';
import { UserModel } from '@app/api/models/user-model';
import { logger } from '@sotaoi/api/logger';

class UserRetrieve extends RetrieveHandler {
  public async model(): Promise<UserModel> {
    return new UserModel();
  }
  public async handle(retrieve: Retrieve): Promise<RetrieveResult> {
    try {
      const user = await new UserModel().db().findOne({ uuid: retrieve.uuid }).lean();
      if (!user) {
        const error = new Error('Retrieve failed');
        error.message = 'Not found';
        throw error;
      }
      const result = new RetrieveResult(
        200,
        'Retrieve success',
        'Retrieve was successful',
        await this.transform(user, retrieve.variant),
        null,
      );
      if (!user.address) {
        throw new Error('failed to fetch address for user');
      }
      return result;
    } catch (err) {
      logger().estack(err);
      return new RetrieveResult(
        400,
        err && err.name ? err.name : 'Error',
        err && err.message ? err.message : 'Retrieve failed',
        null,
        null,
      );
    }
  }
}

export { UserRetrieve };
