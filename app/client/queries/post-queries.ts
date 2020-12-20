import { QueryResult } from '@sotaoi/omni/transactions';
import { Action } from '@sotaoi/client/action';
import { RequestAbortHandler } from '@sotaoi/client/components';
import { store } from '@sotaoi/client/store';

const getAllPostsQuery = () => {
  return (props: { [key: string]: any }, requestAbortHandler: RequestAbortHandler): Promise<QueryResult> =>
    Action.flistQuery(store().getAccessToken(), null, 'post', 'get-all', null, requestAbortHandler);
};

const getPost = () => {
  return (props: { [key: string]: any }, requestAbortHandler: RequestAbortHandler): Promise<any> =>
    Action.retrieve(store().getAccessToken(), 'public', 'post', props.uuid, null, requestAbortHandler);
};

export { getAllPostsQuery, getPost };
