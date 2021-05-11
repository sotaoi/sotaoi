import { StoreHandler } from '@sotaoi/api/commands/store-handler';
import { UpdateHandler } from '@sotaoi/api/commands/update-handler';
import { QueryHandler } from '@sotaoi/api/queries/query-handlers';
import { RetrieveHandler } from '@sotaoi/api/queries/retrieve-handler';
import { RemoveHandler } from '@sotaoi/api/commands/remove-handler';
import { AuthHandler } from '@sotaoi/api/commands/auth-handler';
import { TaskHandler } from '@sotaoi/api/commands/task-handler';
import { FormValidations } from '@sotaoi/omni/input';
import { QueryFilters } from '@sotaoi/omni/transactions';
import { ResponseToolkit } from '@hapi/hapi';
import { Model } from '@sotaoi/api/db/model';
import { controlPanel as controlPanelForms } from '@sotaoi/omni/control-panel/forms';
import { SetInstallStatusTask } from '@sotaoi/api/control-panel/handlers/set-install-status-task';
import { Helper } from '@sotaoi/api/helper';

interface RepositoryHandlers {
  store?: typeof StoreHandler;
  update?: typeof UpdateHandler;
  query?: { [key: string]: typeof QueryHandler };
  retrieve?: typeof RetrieveHandler;
  remove?: typeof RemoveHandler;
  auth?: typeof AuthHandler;
  task?: { [key: string]: typeof TaskHandler };
}

const controlPanelHandlers: RepositoryHandlers = {
  task: { 'set-install-status-task': SetInstallStatusTask },
};

class Setup {
  protected static handlers: { [key: string]: RepositoryHandlers };
  protected static models: { [key: string]: Model };
  protected static forms: { [key: string]: { [key: string]: FormValidations } };

  public static async init(
    handlers: { [key: string]: RepositoryHandlers },
    formSet: { [key: string]: { [key: string]: () => Promise<FormValidations> } },
  ): Promise<void> {
    this.handlers = handlers;
    this.forms = {};
    for (const [repository, form] of Object.entries(formSet)) {
      this.forms[repository] = {};
      for (const [formId, validations] of Object.entries(form)) {
        this.forms[repository][formId] = await validations();
      }
    }
  }

  public static getStoreHandler(repository: string, handler: ResponseToolkit): StoreHandler {
    const storeHandler = this.handlers[repository].store;
    if (!storeHandler) {
      throw new Error('no handler found');
    }
    return new (storeHandler as any)(handler);
  }
  public static getUpdateHandler(repository: string, handler: ResponseToolkit): StoreHandler {
    const updateHandler = this.handlers[repository].update;
    if (!updateHandler) {
      throw new Error('no handler found');
    }
    return new (updateHandler as any)(handler);
  }
  public static getQueryHandler<Filters extends QueryFilters>(
    repository: string,
    list: string,
    handler: ResponseToolkit,
  ): QueryHandler {
    const queryHandlers = this.handlers[repository].query;
    if (!queryHandlers || !queryHandlers[list]) {
      throw new Error('no handler found');
    }
    return new (queryHandlers[list] as any)(handler);
  }
  public static getRetrieveHandler(repository: string, handler: ResponseToolkit): RetrieveHandler {
    const retrieveHandler = this.handlers[repository].retrieve;
    if (!retrieveHandler) {
      throw new Error('no handler found');
    }
    return new (retrieveHandler as any)(handler);
  }
  public static getRemoveHandler(repository: string, handler: ResponseToolkit): RemoveHandler {
    const removeHandler = this.handlers[repository].remove;
    if (!removeHandler) {
      throw new Error('no handler found');
    }
    return new (removeHandler as any)(handler);
  }
  // get remove handler
  public static getAuthHandler(repository: string, handler: ResponseToolkit): AuthHandler {
    const authHandler = this.handlers[repository].auth;
    if (!authHandler) {
      throw new Error('no handler found');
    }
    return new (authHandler as any)(handler);
  }
  public static getTaskHandler(repository: string, task: string, handler: ResponseToolkit): TaskHandler {
    try {
      const taskHandlers = this.handlers[repository].task;
      if (!taskHandlers || !taskHandlers[task]) {
        throw new Error('no handler found');
      }
      return new (taskHandlers[task] as any)(handler);
    } catch (err) {
      // control panel tasks for uninstalled bundles
      if (!Helper.getBundleJson().installed && controlPanelHandlers.task && controlPanelHandlers.task[task]) {
        return new (controlPanelHandlers.task[task] as any)(handler);
      }
      throw err;
    }
  }

  public static getModel(key: string): Model {
    return this.models[key] || null;
  }

  public static getForm(repository: string, formId: string): FormValidations {
    if (!this.forms[repository] || !this.forms[repository][formId]) {
      if (!Helper.getBundleJson().installed && controlPanelForms[formId]) {
        return controlPanelForms[formId]();
      }
      throw new Error('form does not exist');
    }
    return this.forms[repository][formId];
  }
}

export { Setup };
export type { RepositoryHandlers };
