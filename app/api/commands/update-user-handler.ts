import { CommandResult } from '@sotaoi/omni/transactions';
import { UpdateCommand } from '@sotaoi/api/commands';
import { db } from '@sotaoi/api/db';
import { RecordRef } from '@sotaoi/omni/artifacts';
import { UpdateHandler } from '@sotaoi/api/commands/update-handler';
import { storage } from '@sotaoi/api/storage';

class UpdateUserHandler extends UpdateHandler {
  public getFormId = async (): Promise<string> => 'user-command-form';

  public async handle(command: UpdateCommand): Promise<CommandResult> {
    const { email, password, avatar, address } = command.payload;
    const addressUuid = JSON.parse((await db('user').select('address').where('uuid', command.uuid).first()).address)
      .uuid;
    const [saveAvatar, avatarAsset, cancelAvatar] = storage('main').save(
      { domain: 'public', group: 'user', division: command.uuid, pathname: 'avatar.png' },
      avatar,
    );

    if (!addressUuid) {
      throw new Error('something went wrong - failed to fetch address for user while updating');
    }
    await db('address')
      .update({
        street: address.street.serialize(true),
        country: address.country.serialize(true),
      })
      .where('uuid', addressUuid);
    await db('user')
      .update({
        email: email.serialize(true),
        password: password.serialize(true),
        avatar: avatarAsset?.serialize(true) || null,
      })
      .where('uuid', command.uuid);

    // !! process image (convert to png or some other image format)
    saveAvatar();

    return new CommandResult(
      true,
      {
        code: 200,
        title: 'Hello',
        msg: 'Command test',
        ref: new RecordRef('user', command.uuid),
      },
      null,
    );
  }
}

export { UpdateUserHandler };
