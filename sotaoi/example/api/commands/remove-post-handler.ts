import { CommandResult } from '@sotaoi/omni/transactions';
import { UpdateCommand } from '@sotaoi/api/commands';
import { Artifact } from '@sotaoi/omni/artifacts';
import { UpdateHandler } from '@sotaoi/api/commands/update-handler';
import { GenericModel } from '@sotaoi/api/db/generic-model';

class RemovePostHandler extends UpdateHandler {
  public getFormId = async (): Promise<string> => 'post-update-form';

  public async handle(command: UpdateCommand): Promise<CommandResult> {
    await new GenericModel('post').db().deleteOne({ uuid: command.uuid });
    return new CommandResult(200, 'Hello', 'Deleted Post', new Artifact('post', command.uuid), null);
  }
}

export { RemovePostHandler };
