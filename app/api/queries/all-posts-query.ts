import { FlistQueryHandler } from '@sotaoi/api/queries/query-handlers';
import { QueryResult, FlistQuery } from '@sotaoi/omni/transactions';
import { db } from '@sotaoi/api/db';
import { RecordEntry } from '@sotaoi/omni/artifacts';
import { GenericModel } from '@sotaoi/api/models/generic-model';
import { Model } from '@sotaoi/api/models/model';

class AllPostsQuery extends FlistQueryHandler {
  public async model(): Promise<Model> {
    return new GenericModel('post');
  }

  public async handle(query: FlistQuery): Promise<QueryResult> {
    try {
      const postModel = new GenericModel('post');
      const posts: RecordEntry[] = [];
      for (const post of await db('post').orderBy('id', 'desc')) {
        posts.push(await postModel.transform(post, null));
      }
      return new QueryResult(200, 'Query success', 'Query was successful', await this.transform(posts, null), null);
    } catch (err) {
      return new QueryResult(400, 'Error', 'Query failed', null, null);
    }
  }
}

export { AllPostsQuery };
