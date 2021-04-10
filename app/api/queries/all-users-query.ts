import { FlistQueryHandler } from '@sotaoi/api/queries/query-handlers';
import { QueryResult, FlistQuery } from '@sotaoi/omni/transactions';
import { db } from '@sotaoi/api/db';
import { UserModel } from '@app/api/models/user-model';
import { Model } from '@sotaoi/api/models/model';

class AllUsersQuery extends FlistQueryHandler {
  public async model(): Promise<Model> {
    return new UserModel();
  }

  public async handle(query: FlistQuery): Promise<QueryResult> {
    if (!(await this.requireArtifact(query.authRecord).ofType('user'))) {
      return new QueryResult(401, 'Unauthorized', 'No authorization to run query', null, null);
    }

    try {
      const users = await db('user').orderBy('id', 'desc');
      return new QueryResult(200, 'Query success', 'Query was successful', await this.transform(users, null), null);
    } catch (err) {
      return new QueryResult(400, 'Error', 'Query failed', null, null);
    }
  }
}

export { AllUsersQuery };
