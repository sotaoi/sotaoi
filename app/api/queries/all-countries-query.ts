import { FlistQueryHandler } from '@sotaoi/api/queries/query-handlers';
import { QueryResult, FlistQuery } from '@sotaoi/omni/transactions';
import { db } from '@sotaoi/api/db';
import { logger } from '@sotaoi/api/logger';
import { Model } from '@sotaoi/api/models/model';
import { CountryModel } from '@app/api/models/country-model';

class AllCountriesQuery extends FlistQueryHandler {
  public async model(): Promise<Model> {
    return new CountryModel();
  }

  public async handle(query: FlistQuery): Promise<QueryResult> {
    try {
      const countries = db('country').orderBy('id', 'desc');
      countries.where(query.filters?.where || true);
      query.filters?.limit && countries.limit(query.filters.limit);
      return new QueryResult(
        200,
        'Query success',
        'Query was successful',
        await this.transform(await countries, null),
        null,
      );
    } catch (err) {
      logger().error(err && err.stack ? err.stack : err);
      return new QueryResult(400, 'Error', 'Query failed', null, null);
    }
  }
}

export { AllCountriesQuery };
