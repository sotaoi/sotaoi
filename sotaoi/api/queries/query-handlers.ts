import { FlistQuery, QueryResult, PlistQuery, SlistQuery } from '@sotaoi/omni/transactions';
import { BaseHandler } from '@sotaoi/api/base-handler';

abstract class QueryHandler extends BaseHandler {
  abstract async handle(query: FlistQuery | PlistQuery | SlistQuery): Promise<QueryResult>;
}

abstract class FlistQueryHandler extends QueryHandler {
  abstract async handle(query: FlistQuery): Promise<QueryResult>;
}

abstract class PlistQueryHandler extends QueryHandler {
  abstract async handle(query: PlistQuery): Promise<QueryResult>;
}

abstract class SlistQueryHandler extends QueryHandler {
  abstract async handle(query: SlistQuery): Promise<QueryResult>;
}

export { QueryHandler, FlistQueryHandler, PlistQueryHandler, SlistQueryHandler };
