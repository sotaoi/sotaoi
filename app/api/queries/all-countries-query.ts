import { FlistQueryHandler } from '@sotaoi/api/queries/query-handlers';
import { QueryResult, FlistQuery } from '@sotaoi/omni/transactions';
import { db } from '@sotaoi/api/db';

class AllCountriesQuery extends FlistQueryHandler {
  public async handle(query: FlistQuery): Promise<QueryResult> {
    try {
      const countries = db('country').orderBy('id', 'desc');
      countries.where(query.filters?.where || true);
      query.filters?.limit && countries.limit(query.filters.limit);
      return new QueryResult(
        true,
        {
          code: 200,
          title: 'Query success',
          msg: 'Query was successful',
          records: await countries,
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

export { AllCountriesQuery };
