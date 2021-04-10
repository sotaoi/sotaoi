import { CommandResult } from '@sotaoi/omni/transactions';
import { UpdateCommand } from '@sotaoi/api/commands';
import { BaseHandler } from '@sotaoi/api/base-handler';

abstract class UpdateHandler extends BaseHandler {
  abstract async getFormId(): Promise<string>;
  abstract async handle(command: UpdateCommand): Promise<CommandResult>;
  public async __handle__(command: UpdateCommand): Promise<CommandResult> {
    const result = await this.handle(command);
    return result;
  }
}

export { UpdateHandler };
