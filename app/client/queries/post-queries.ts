import { FlistFilters, QueryResult } from '@sotaoi/omni/transactions';
import { Action } from '@sotaoi/client/action';
import { RequestAbortHandler } from '@sotaoi/client/components';
import { store } from '@sotaoi/client/store';
import { Helper } from '@sotaoi/client/helper';

const getAllPostsQuery = () => {
  return (props: { [key: string]: any }, requestAbortHandler: RequestAbortHandler): Promise<QueryResult> => {
    let filters: null | FlistFilters = null;

    if (props.filters) {
      filters = new FlistFilters(Helper.decodeSegment(props.filters), 100);
    }
    return Action.flistQuery(store().getAccessToken(), null, 'post', 'get-all', filters, requestAbortHandler);
  };
};

const getPost = () => {
  return (props: { [key: string]: any }, requestAbortHandler: RequestAbortHandler): Promise<any> =>
    Action.retrieve(store().getAccessToken(), 'public', 'post', props.uuid, null, requestAbortHandler);
};

export { getAllPostsQuery, getPost };
