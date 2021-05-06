import { ActionConclusion, TaskResult } from '@sotaoi/omni/transactions';
import { store } from '@sotaoi/client/store';
import { notification } from '@sotaoi/client/notification';
import { Output } from '@sotaoi/omni/output';

const installBundle = (): Promise<ActionConclusion> => {
  return new Promise((resolve, reject) => {
    try {
      const apiUrl = store().getApiUrl();
      const formData = new FormData();
      formData.append('accessToken', '');
      formData.append('role', '');
      formData.append('repository', 'controlPanel');
      formData.append('task', 'set-install-status-task');
      fetch(apiUrl + '/task', { method: 'POST', body: formData })
        .then((res) => {
          res
            .json()
            .then((res) => {
              resolve(notification().conclusion(Output.parseTask(res)));
            })
            .catch((err) => {
              throw err;
            });
        })
        .catch((err) => {
          throw err;
        });
    } catch (err) {
      reject(notification().conclusion(new TaskResult(400, 'Error', 'Something went wrong', null, null)));
    }
  });
};

export { installBundle };
