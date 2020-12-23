import { StoreHandler } from '@sotaoi/api/commands/store-handler';
import { CommandResult } from '@sotaoi/omni/transactions';
import { StoreCommand } from '@sotaoi/api/commands';
import { db } from '@sotaoi/api/db';
import { Helper } from '@sotaoi/api/helper';
import { RecordRef } from '@sotaoi/omni/artifacts';
import { storage } from '@sotaoi/api/storage';

class StoreUserHandler extends StoreHandler {
  public getFormId = async (): Promise<string> => 'user-command-form';

  public async handle(command: StoreCommand): Promise<CommandResult> {
    const { email, password, avatar, address } = command.payload;
    const userUuid = Helper.uuid();
    const addressUuid = Helper.uuid();
    const [saveAvatar, avatarAsset, cancelAvatar] = storage('main').save(
      { domain: 'public', group: 'user', division: userUuid, pathname: 'avatar.png' },
      avatar,
    );
    await db('address').insert({
      uuid: addressUuid,
      street: address.street.serialize(true),
      country: address.country.serialize(true),
    });
    await db('user').insert({
      uuid: userUuid,
      email: email.serialize(true),
      avatar: avatarAsset?.serialize(true) || null,
      password: password.serialize(true),
      address: new RecordRef('address', addressUuid).serialize(null),
    });

    // !! process image (convert to png or some other image format)
    saveAvatar();

    return new CommandResult(
      true,
      {
        code: 200,
        title: 'Hello',
        msg: 'Command test',
        ref: new RecordRef('user', userUuid),
      },
      null,
    );
  }
}

export { StoreUserHandler };
