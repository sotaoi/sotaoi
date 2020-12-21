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
    const { email, password, address, avatar } = command.payload;
    const userUuid = Helper.uuid();
    const addressUuid = Helper.uuid();
    await db('address').insert({
      uuid: addressUuid,
      street: address.street.serialize(true),
      country: address.country.serialize(true),
    });
    await db('user').insert({
      uuid: userUuid,
      email: email.serialize(true),
      password: password.serialize(true),
      address: new RecordRef('address', addressUuid).serialize(null),
    });

    avatar && storage().save('/repositories/user/avatars', avatar);

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
