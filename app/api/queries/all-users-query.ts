import { FlistQueryHandler } from '@sotaoi/api/queries/query-handlers';
import { QueryResult, FlistQuery } from '@sotaoi/omni/transactions';
import { db } from '@sotaoi/api/db';
import { RecordEntry } from '@sotaoi/omni/artifacts';

class AllUsersQuery extends FlistQueryHandler {
  public async handle(query: FlistQuery): Promise<QueryResult> {
    if (!(await this.requireArtifact(query.authRecord).ofType('user'))) {
      return new QueryResult(401, 'Unauthorized', 'No authorization to run query', null, null);
    }

    try {
      const users = (await db('user').orderBy('id', 'desc')).map((user: RecordEntry) => {
        delete user.password;
        return user;
      });
      return new QueryResult(200, 'Query success', 'Query was successful', users, null);
    } catch (err) {
      return new QueryResult(400, 'Error', 'Query failed', null, null);
    }
  }
}

export { AllUsersQuery };
