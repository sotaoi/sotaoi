import { TaskResult } from '@sotaoi/omni/transactions';
import { logger } from '@sotaoi/api/logger';
import { TaskHandler } from '@sotaoi/api/commands/task-handler';
import { TaskCommand } from '@sotaoi/api/commands';
import BundleJson from '@sotaoi/omni/bundle.json';
import fs from 'fs';
import path from 'path';

class SetInstallStatusTask extends TaskHandler {
  public getFormId = async (): Promise<string> => 'set-install-status-task';

  public async handle(task: TaskCommand): Promise<TaskResult> {
    try {
      if (BundleJson.installed) {
        throw new Error('Bundle is already installed');
      }
      BundleJson.installed = true;
      fs.writeFileSync(path.resolve('./sotaoi/omni/bundle.json'), JSON.stringify(BundleJson, null, 2));
      return new TaskResult(200, 'Install success', 'Install was successful', { ok: true }, null);
    } catch (err) {
      logger().estack(err);
      return new TaskResult(200, 'Install failed', 'Install was not successful', { ok: false }, null);
    }
  }
}

export { SetInstallStatusTask };
