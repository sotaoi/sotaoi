import { RetrieveHandler } from '@sotaoi/api/queries/retrieve-handler';
import { RetrieveResult } from '@sotaoi/omni/transactions';
import { Retrieve } from '@sotaoi/omni/transactions';
import { GenericModel } from '@sotaoi/api/models/generic-model';
import { UserModel } from '@app/api/models/user-model';
import { logger } from '@sotaoi/api/logger';

class PostRetrieve extends RetrieveHandler {
  public async model(): Promise<GenericModel> {
    return new GenericModel('post');
  }
  public async handle(retrieve: Retrieve): Promise<RetrieveResult> {
    try {
      const post = await new GenericModel('post').db().findOne({ uuid: retrieve.uuid }).lean();
      const category = await new GenericModel('category')
        .db()
        .findOne({ uuid: JSON.parse(post.category).uuid })
        .lean();
      post.categoryName = category.name;
      const user = await new UserModel()
        .db()
        .findOne({ uuid: JSON.parse(post.createdBy).uuid })
        .lean();
      post.userName = user.email;

      if (!post) {
        const error = new Error('Retrieve failed');
        error.message = 'Not found';
        throw error;
      }
      return new RetrieveResult(
        200,
        'Retrieve success',
        'Retrieve was successful',
        await this.transform(post, null),
        null,
      );
    } catch (err) {
      logger().error(err && err.stack ? err.stack : err);
      return new RetrieveResult(400, 'Error', 'Retrieve failed', null, null);
    }
  }
}

export { PostRetrieve };
