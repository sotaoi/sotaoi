import { FlistQueryHandler } from '@sotaoi/api/queries/query-handlers';
import { QueryResult, FlistQuery } from '@sotaoi/omni/transactions';
import { db } from '@sotaoi/api/db';

class AllPostsQuery extends FlistQueryHandler {
  public async handle(query: FlistQuery): Promise<QueryResult> {
    try {
      const posts = await db('post').orderBy('id', 'desc');
      return new QueryResult(200, 'Query success', 'Query was successful', posts, null);
    } catch (err) {
      return new QueryResult(400, 'Error', 'Query failed', null, null);
    }
  }
}

export { AllPostsQuery };
