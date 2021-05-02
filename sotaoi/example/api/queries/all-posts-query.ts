import { FlistQueryHandler } from '@sotaoi/api/queries/query-handlers';
import { QueryResult, FlistQuery } from '@sotaoi/omni/transactions';
import { GenericModel } from '@sotaoi/api/db/generic-model';
import { Model } from '@sotaoi/api/db/model';
import { logger } from '@sotaoi/api/logger';

class AllPostsQuery extends FlistQueryHandler {
  public async model(): Promise<Model> {
    return new GenericModel('post');
  }

  public async handle(query: FlistQuery): Promise<QueryResult> {
    try {
      const posts = new GenericModel('post').db().find({});
      posts.sort([['createdAt', -1]]);
      return new QueryResult(
        200,
        'Query success',
        'Query was successful',
        await this.transform(await posts.lean(), null),
        null,
      );
    } catch (err) {
      logger().estack(err);
      return new QueryResult(400, 'Error', 'Query failed', null, null);
    }
  }
}

export { AllPostsQuery };
