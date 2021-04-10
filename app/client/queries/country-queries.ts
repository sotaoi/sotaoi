import { FlistFilters, QueryResult } from '@sotaoi/omni/transactions';
import { Action } from '@sotaoi/client/action';
import { Helper } from '@sotaoi/client/helper';
import { RequestAbortHandler } from '@sotaoi/client/components';
import { store } from '@sotaoi/client/store';

const getAllCountriesQuery = () => {
  return (props: { [key: string]: any }, requestAbortHandler: RequestAbortHandler): Promise<QueryResult> => {
    let filters: null | FlistFilters = null;
    if (props.filters) {
      filters = new FlistFilters(Helper.decodeSegment(props.filters), 100);
    }
    return Action.flistQuery(store().getAccessToken(), null, 'country', 'get-all', filters, null, requestAbortHandler);
  };
};

export { getAllCountriesQuery };
