import { FlistQueryHandler } from '@sotaoi/api/queries/query-handlers';
import { QueryResult, FlistQuery } from '@sotaoi/omni/transactions';
import { db } from '@sotaoi/api/db';

class AllUsersQuery extends FlistQueryHandler {
  public async handle(query: FlistQuery): Promise<QueryResult> {
    if (!(await this.requireArtifact(query.authRecord).ofType('user'))) {
      return new QueryResult(false, null, {
        code: 401,
        title: 'Unauthorized',
        msg: 'No authorization to run query',
        validations: null,
      });
    }

    try {
      const users = await db('user').orderBy('id', 'desc');
      return new QueryResult(
        true,
        {
          code: 200,
          title: 'Query success',
          msg: 'Query was successful',
          records: users,
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

export { AllUsersQuery };
