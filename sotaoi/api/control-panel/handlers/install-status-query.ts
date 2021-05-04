import { TaskResult } from '@sotaoi/omni/transactions';
import { logger } from '@sotaoi/api/logger';
import { TaskHandler } from '@sotaoi/api/commands/task-handler';
import { TaskCommand } from '@sotaoi/api/commands';

class GetInstallStatusTask extends TaskHandler {
  public getFormId = async (): Promise<string> => 'get-install-status-task';

  public async handle(query: TaskCommand): Promise<TaskResult> {
    try {
      return new TaskResult(200, 'Query success', 'Query was successful', { isInstalled: false }, null);
    } catch (err) {
      logger().estack(err);
      return new TaskResult(200, 'Query success', 'Query was successful', { isInstalled: false }, null);
    }
  }
}

export { GetInstallStatusTask };
