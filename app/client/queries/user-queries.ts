import { QueryResult, RetrieveResult, RetrieveAction, QueryAction } from '@sotaoi/omni/transactions';
import { Action } from '@sotaoi/client/action';
import { RequestAbortHandler } from '@sotaoi/client/components';
import { store } from '@sotaoi/client/store';

const getAllUsersQuery = (): QueryAction => {
  return (props: { [key: string]: any }, requestAbortHandler: RequestAbortHandler): Promise<QueryResult> =>
    Action.flistQuery(store().getAccessToken(), null, 'user', 'get-all', null, null, requestAbortHandler);
};

const getUser = (): RetrieveAction => {
  return (props: { [key: string]: any }, requestAbortHandler: RequestAbortHandler): Promise<RetrieveResult> =>
    Action.retrieve(store().getAccessToken(), 'public', 'user', props.uuid, null, requestAbortHandler);
};

export { getAllUsersQuery, getUser };
