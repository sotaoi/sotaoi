import { FlistFilters, QueryResult, RetrieveResult } from '@sotaoi/omni/transactions';
import { Action } from '@sotaoi/client/action';
import { Helper } from '@sotaoi/client/helper';
import { RequestAbortHandler } from '@sotaoi/client/components';
import { store } from '@sotaoi/client/store';

const getAllCategoriesQuery = () => {
  return (props: { [key: string]: any }, requestAbortHandler: RequestAbortHandler): Promise<QueryResult> => {
    let filters: null | FlistFilters = null;
    if (props.filters) {
      filters = new FlistFilters(Helper.decodeSegment(props.filters), 100);
    }
    return Action.flistQuery(store().getAccessToken(), null, 'category', 'get-all', filters, requestAbortHandler);
  };
};
const getCategory = () => {
  return (props: { [key: string]: any }, requestAbortHandler: RequestAbortHandler): Promise<RetrieveResult> =>
    Action.retrieve(store().getAccessToken(), 'public', 'category', props.uuid, null, requestAbortHandler);
};

export { getAllCategoriesQuery, getCategory };
