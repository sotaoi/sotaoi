import { CommandResult } from '@sotaoi/omni/transactions';
import { RemoveCommand } from '@sotaoi/api/commands';
import { BaseHandler } from '@sotaoi/api/base-handler';

abstract class RemoveHandler extends BaseHandler {
  abstract handle(command: RemoveCommand): Promise<CommandResult>;
}

export { RemoveHandler };
