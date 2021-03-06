import { FlistQueryHandler } from '@sotaoi/api/queries/query-handlers';
import { QueryResult, FlistQuery } from '@sotaoi/omni/transactions';
import { logger } from '@sotaoi/api/logger';
import { Model } from '@sotaoi/api/db/model';
import { CountryModel } from '@app/api/models/country-model';

class AllCountriesQuery extends FlistQueryHandler {
  public async model(): Promise<Model> {
    return new CountryModel();
  }

  public async handle(query: FlistQuery): Promise<QueryResult> {
    try {
      const countries = new CountryModel().db().find(query.filters?.where || {});
      query.filters?.limit && countries.limit(query.filters.limit);
      countries.sort([['createdAt', -1]]);
      return new QueryResult(
        200,
        'Query success',
        'Query was successful',
        await this.transform(await countries.lean(), null),
        null,
      );
    } catch (err) {
      logger().estack(err);
      return new QueryResult(400, 'Error', 'Query failed', null, null);
    }
  }
}

export { AllCountriesQuery };
