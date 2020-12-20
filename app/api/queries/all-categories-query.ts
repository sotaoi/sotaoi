import { FlistQueryHandler } from '@sotaoi/api/queries/query-handlers';
import { QueryResult, FlistQuery } from '@sotaoi/omni/transactions';
import { db } from '@sotaoi/api/db';

class AllCategoriesQuery extends FlistQueryHandler {
  public async handle(query: FlistQuery): Promise<QueryResult> {
    try {
      const categories = db('category').orderBy('id', 'desc');
      categories.where(query.filters?.where || true);
      query.filters?.limit && categories.limit(query.filters.limit);
      return new QueryResult(
        true,
        {
          code: 200,
          title: 'Query success',
          msg: 'Query was successful',
          records: await categories,
        },
        null,
      );
    } catch (err) {
      return new QueryResult(false, null, {
        code: 400,
        title: err && err.name ? err.name : 'Error',
        msg: err && err.stack ? err.stack : err && err.message ? err.message : 'Query failed',
        validations: null,
      });
    }
  }
}

export { AllCategoriesQuery };
