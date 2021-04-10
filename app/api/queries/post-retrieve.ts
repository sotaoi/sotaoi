import { RetrieveHandler } from '@sotaoi/api/queries/retrieve-handler';
import { RetrieveResult } from '@sotaoi/omni/transactions';
import { Retrieve } from '@sotaoi/omni/transactions';
import { db } from '@sotaoi/api/db';
import { GenericModel } from '@sotaoi/api/models/generic-model';

class PostRetrieve extends RetrieveHandler {
  public async model(): Promise<GenericModel> {
    return new GenericModel('post');
  }
  public async handle(retrieve: Retrieve): Promise<RetrieveResult> {
    try {
      const post = await db('post').where('uuid', retrieve.uuid).first();
      const category = await db('category').where('uuid', JSON.parse(post.category).uuid).first();
      post.categoryName = category.name;
      // post.category = category;
      const user = await db('user').where('uuid', JSON.parse(post.createdBy).uuid).first();
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
      return new RetrieveResult(400, 'Error', 'Retrieve failed', null, null);
    }
  }
}

export { PostRetrieve };
