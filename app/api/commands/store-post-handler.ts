import { StoreHandler } from '@sotaoi/api/commands/store-handler';
import { CommandResult } from '@sotaoi/omni/transactions';
import { StoreCommand } from '@sotaoi/api/commands';
import { db } from '@sotaoi/api/db';
import { Helper } from '@sotaoi/api/helper';
import { RecordRef, Artifact } from '@sotaoi/omni/artifacts';

class StorePostHandler extends StoreHandler {
  public getFormId = async (): Promise<string> => 'post-form';

  public async handle(command: StoreCommand): Promise<CommandResult> {
    const { title, content, user, category } = command.payload;
    const postUuid = Helper.uuid();
    await db('post').insert({
      uuid: postUuid,
      title: title.serialize(true),
      content: content.serialize(true),
      createdBy: new RecordRef('user', user.value.uuid).serialize(null),
      category: new RecordRef('category', category.value.uuid).serialize(null),
    });

    return new CommandResult(
      true,
      {
        code: 200,
        title: 'result',
        msg: 'post added',
        artifact: new Artifact('post', postUuid),
      },
      null,
    );
  }
}

export { StorePostHandler };
