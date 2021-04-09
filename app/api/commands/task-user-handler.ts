import { TaskResult } from '@sotaoi/omni/transactions';
import { TaskCommand } from '@sotaoi/api/commands';
import { TaskHandler } from '@sotaoi/api/commands/task-handler';

class TaskUserHandler extends TaskHandler {
  public getFormId = async (): Promise<string> => 'user-hello-task';

  public async handle(command: TaskCommand): Promise<TaskResult> {
    return new TaskResult(
      200,
      'Hello',
      'Task test',
      {
        ok: 'boomer',
      },
      null,
    );
  }
}

export { TaskUserHandler };
