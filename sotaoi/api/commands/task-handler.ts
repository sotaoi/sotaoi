import { TaskResult } from '@sotaoi/omni/transactions';
import { TaskCommand } from '@sotaoi/api/commands';
import { BaseHandler } from '@sotaoi/api/base-handler';

abstract class TaskHandler extends BaseHandler {
  abstract async getFormId(): Promise<string>;
  abstract async handle(command: TaskCommand): Promise<TaskResult>;
  public async __handle__(command: TaskCommand): Promise<TaskResult> {
    const result = await this.handle(command);
    return result;
  }
}

export { TaskHandler };
