import { FlistQueryHandler } from '@sotaoi/api/queries/query-handlers';
import { QueryResult, FlistQuery } from '@sotaoi/omni/transactions';
import { db } from '@sotaoi/api/db';
import { logger } from '@sotaoi/api/logger';

class AllCategoriesQuery extends FlistQueryHandler {
  public async handle(query: FlistQuery): Promise<QueryResult> {
    try {
      const categories = db('category').orderBy('id', 'desc');
      categories.where(query.filters?.where || true);
      query.filters?.limit && categories.limit(query.filters.limit);
      return new QueryResult(200, 'Query success', 'Query was successful', await categories, null);
    } catch (err) {
      logger().error(err && err.stack ? err.stack : err);
      return new QueryResult(400, 'Error', 'Query failed', null, null);
    }
  }
}

export { AllCategoriesQuery };
