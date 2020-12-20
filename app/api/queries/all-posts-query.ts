import { FlistQueryHandler } from '@sotaoi/api/queries/query-handlers';
import { QueryResult, FlistQuery } from '@sotaoi/omni/transactions';
import { db } from '@sotaoi/api/db';

class AllPostsQuery extends FlistQueryHandler {
  public async handle(query: FlistQuery): Promise<QueryResult> {
    try {
      const posts = await db('post').orderBy('id', 'desc');
      return new QueryResult(
        true,
        {
          code: 200,
          title: 'Query success',
          msg: 'Query was successful',
          records: posts,
        },
        null,
      );
    } catch (err) {
      return new QueryResult(false, null, {
        code: 400,
        title: 'Error',
        msg: 'Query failed',
        validations: null,
      });
    }
  }
}

export { AllPostsQuery };
