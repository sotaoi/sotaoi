import {
  Payload,
  CommandResult,
  RetrieveResult,
  QueryResult,
  AuthResult,
  TaskResult,
  FlistFilters,
  PlistFilters,
  SlistFilters,
} from '@sotaoi/omni/transactions';
import { Output } from '@sotaoi/omni/output';
import { Artifacts } from '@sotaoi/omni/artifacts';
import { RequestAbortHandler } from '@sotaoi/client/components';
import { store } from '@sotaoi/client/store';

// maybe split file in action types

class Action {
  public static async store(
    accessToken: null | string,
    artifacts: Artifacts,
    role: null | string,
    repository: string,
    payload: Payload,
  ): Promise<CommandResult> {
    try {
      const apiUrl = store().getApiUrl();
      const formData = payload.getFormData();
      formData.append('accessToken', accessToken || '');
      formData.append('role', role || '');
      formData.append('repository', repository || '');
      return Output.parseCommand(await (await fetch(apiUrl + '/store', { method: 'POST', body: formData })).json());
    } catch (err) {
      return new CommandResult(false, null, {
        code: 400,
        title: 'Error',
        msg: 'Something went wrong',
        validations: null,
      });
    }
  }

  public static async update(
    accessToken: null | string,
    artifacts: Artifacts,
    role: null | string,
    repository: string,
    uuid: string,
    payload: Payload,
  ): Promise<CommandResult> {
    try {
      const apiUrl = store().getApiUrl();
      const formData = payload.getFormData();
      formData.append('accessToken', accessToken || '');
      formData.append('role', role || '');
      formData.append('repository', repository || '');
      formData.append('uuid', uuid || '');
      return Output.parseCommand(await (await fetch(apiUrl + '/update', { method: 'POST', body: formData })).json());
    } catch (err) {
      return new CommandResult(false, null, {
        code: 400,
        title: 'Error',
        msg: 'Something went wrong',
        validations: null,
      });
    }
  }

  public static async flistQuery(
    accessToken: null | string,
    role: null | string,
    repository: string,
    list: string,
    filters: null | FlistFilters,
    requestAbortHandler: RequestAbortHandler,
  ): Promise<QueryResult> {
    try {
      const apiUrl = store().getApiUrl();
      const formData = new FormData();
      formData.append('type', 'flist');
      formData.append('accessToken', accessToken || '');
      formData.append('role', role || '');
      formData.append('repository', repository);
      formData.append('list', list);
      formData.append('filters', filters ? JSON.stringify(filters) : '');
      const controller = new AbortController();
      requestAbortHandler.register(() => controller.abort());
      return await (
        await fetch(apiUrl + '/query', { signal: controller.signal, method: 'POST', body: formData })
      ).json();
    } catch (err) {
      return new QueryResult(false, null, {
        code: 400,
        title: 'Error',
        msg: 'Something went wrong',
        validations: null,
      });
    }
  }

  public static async plistQuery(
    accessToken: null | string,
    role: null | string,
    repository: string,
    list: string,
    filters: null | PlistFilters,
    requestAbortHandler: RequestAbortHandler,
  ): Promise<QueryResult> {
    // nothing here yet
    return new QueryResult(false, null, {
      code: 400,
      title: 'Error',
      msg: 'Something went wrong',
      validations: null,
    });
  }

  public static async slistQuery(
    accessToken: null | string,
    role: null | string,
    repository: string,
    list: string,
    filters: null | SlistFilters,
    requestAbortHandler: RequestAbortHandler,
  ): Promise<QueryResult> {
    // nothing here yet
    return new QueryResult(false, null, {
      code: 400,
      title: 'Error',
      msg: 'Something went wrong',
      validations: null,
    });
  }

  public static async retrieve(
    accessToken: null | string,
    role: null | string,
    repository: string,
    uuid: string,
    variant: null | string,
    requestAbortHandler: RequestAbortHandler,
  ): Promise<RetrieveResult> {
    try {
      const apiUrl = store().getApiUrl();
      const formData = new FormData();
      formData.append('accessToken', accessToken || '');
      formData.append('role', role || '');
      formData.append('repository', repository);
      formData.append('uuid', uuid);
      formData.append('variant', variant || '');
      const controller = new AbortController();
      requestAbortHandler.register(() => controller.abort());
      return await (
        await fetch(apiUrl + '/retrieve', { signal: controller.signal, method: 'POST', body: formData })
      ).json();
    } catch (err) {
      return new RetrieveResult(false, null, {
        code: 400,
        title: 'Error',
        msg: 'Something went wrong',
        validations: null,
      });
    }
  }

  public static async remove(
    accessToken: null | string,
    role: null | string,
    repository: string,
    uuid: string,
  ): Promise<CommandResult> {
    // nothing here yet
    return new CommandResult(false, null, {
      code: 400,
      title: 'Error',
      msg: 'Something went wrong',
      validations: null,
    });
  }

  public static async auth(
    artifacts: Artifacts,
    repository: string,
    strategy: string,
    payload: Payload,
  ): Promise<AuthResult> {
    try {
      const apiUrl = store().getApiUrl();
      const formData = payload.getFormData();
      formData.append('repository', repository);
      formData.append('strategy', strategy);
      const result = Output.parseAuth(await (await fetch(apiUrl + '/auth', { method: 'POST', body: formData })).json());
      return result;
    } catch (err) {
      return new AuthResult(false, null, {
        code: 400,
        title: 'Error',
        msg: 'Something went wrong',
        validations: null,
      });
    }
  }

  public static async deauth(): Promise<void> {
    await store().setAuthRecord(null);
  }

  public static async task(
    accessToken: null | string,
    artifacts: Artifacts,
    role: null | string,
    repository: string,
    task: string,
    payload: Payload,
  ): Promise<TaskResult> {
    try {
      const apiUrl = store().getApiUrl();
      const formData = payload.getFormData();
      formData.append('accessToken', accessToken || '');
      formData.append('role', role || '');
      formData.append('repository', repository || '');
      formData.append('task', task || '');
      return Output.parseTask(await (await fetch(apiUrl + '/task', { method: 'POST', body: formData })).json());
    } catch (err) {
      return new TaskResult(false, null, {
        code: 400,
        title: 'Error',
        msg: 'Something went wrong',
        validations: null,
      });
    }
  }
}

export { Action };
