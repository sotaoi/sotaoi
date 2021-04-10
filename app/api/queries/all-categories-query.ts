import { FlistQueryHandler } from '@sotaoi/api/queries/query-handlers';
import { QueryResult, FlistQuery } from '@sotaoi/omni/transactions';
import { db } from '@sotaoi/api/db';
import { logger } from '@sotaoi/api/logger';
import { GenericModel } from '@sotaoi/api/models/generic-model';
import { Model } from '@sotaoi/api/models/model';

class AllCategoriesQuery extends FlistQueryHandler {
  public async model(): Promise<Model> {
    return new GenericModel('category');
  }

  public async handle(query: FlistQuery): Promise<QueryResult> {
    try {
      const categories = db('category').orderBy('id', 'desc');
      categories.where(query.filters?.where || true);
      query.filters?.limit && categories.limit(query.filters.limit);
      return new QueryResult(
        200,
        'Query success',
        'Query was successful',
        await this.transform(await categories, null),
        null,
      );
    } catch (err) {
      logger().error(err && err.stack ? err.stack : err);
      return new QueryResult(400, 'Error', 'Query failed', null, null);
    }
  }
}

export { AllCategoriesQuery };
