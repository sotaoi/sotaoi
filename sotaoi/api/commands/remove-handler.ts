import { CommandResult } from '@sotaoi/omni/transactions';
import { RemoveCommand } from '@sotaoi/api/commands';
import { BaseHandler } from '@sotaoi/api/base-handler';

abstract class RemoveHandler extends BaseHandler {
  abstract async handle(command: RemoveCommand): Promise<CommandResult>;
  public async __handle__(command: RemoveCommand): Promise<CommandResult> {
    const result = await this.handle(command);
    return result;
  }
}

export { RemoveHandler };
