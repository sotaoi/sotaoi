import { ActionConclusion } from '@sotaoi/omni/transactions';
import { Action } from '@sotaoi/client/action';
import { store } from '@sotaoi/client/store';
import { RecordRef } from '@sotaoi/omni/artifacts';

const removePost = (post: string | RecordRef): Promise<ActionConclusion> => {
  const postUuid: string = typeof post === 'string' ? post : post.uuid;
  return Action.remove(store().getAccessToken(), null, 'post', postUuid);
};

export { removePost };
