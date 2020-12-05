import { CommandResult } from '@sotaoi/omni/transactions';
import { StoreCommand } from '@sotaoi/api/commands';
import { BaseHandler } from '@sotaoi/api/base-handler';

abstract class StoreHandler extends BaseHandler {
  abstract async getFormId(): Promise<string>;
  abstract async handle(command: StoreCommand): Promise<CommandResult>;
}

export { StoreHandler };
