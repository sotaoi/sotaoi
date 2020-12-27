import { StoreHandler } from '@sotaoi/api/commands/store-handler';
import { CommandResult } from '@sotaoi/omni/transactions';
import { StoreCommand } from '@sotaoi/api/commands';
import { db } from '@sotaoi/api/db';
import { Helper } from '@sotaoi/api/helper';
import { RecordRef, AuthRecord, Artifact } from '@sotaoi/omni/artifacts';
import { storage } from '@sotaoi/api/storage';
import { Asset } from '@sotaoi/omni/input';

class RegisterUserHandler extends StoreHandler {
  public getFormId = async (): Promise<string> => 'user-register-form';

  public async handle(command: StoreCommand): Promise<CommandResult> {
    const { email, password, avatar, gallery, flavor, address } = command.payload;
    const userUuid = Helper.uuid();
    const addressUuid = Helper.uuid();
    const [saveAvatar, avatarAsset, cancelAvatar] = storage('main').handle(
      { domain: 'public', pathname: ['user', userUuid, 'avatar.png'].join('/') },
      avatar,
    );
    const [saveGallery, galleryAssets, removeGallery] = storage('main').multiHandle(
      {
        domain: 'public',
        pathname: ['user', userUuid, 'gallery'].join('/'),
      },
      gallery,
    );
    await db('address').insert({
      uuid: addressUuid,
      street: address.street.serialize(true),
      country: address.country.serialize(true),
    });
    await db('user').insert({
      uuid: userUuid,
      email: email.serialize(true),
      password: password.serialize(true),
      avatar: avatarAsset.serialize(true),
      gallery: Asset.serializeMulti(galleryAssets),
      flavor: flavor.serialize(true),
      address: new RecordRef('address', addressUuid).serialize(null),
    });

    saveAvatar();
    saveGallery();

    const accessToken = Helper.uuid();
    const user = await db('user').where('uuid', userUuid).first();
    const authRecord = new AuthRecord('user', userUuid, user.createdAt, true).setPocket({ accessToken });
    // better token encryption needed here
    await db('access-token').insert({
      uuid: Helper.uuid(),
      user: authRecord.serial,
      token: accessToken,
    });
    this.handler.state('accessToken', accessToken);

    return new CommandResult(
      true,
      {
        code: 200,
        title: 'Hello',
        msg: 'You are authenticated',
        artifact: authRecord,
      },
      null,
    );
  }
}

export { RegisterUserHandler };
