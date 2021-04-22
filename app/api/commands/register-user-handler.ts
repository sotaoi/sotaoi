import { StoreHandler } from '@sotaoi/api/commands/store-handler';
import { CommandResult } from '@sotaoi/omni/transactions';
import { StoreCommand } from '@sotaoi/api/commands';
import { db } from '@sotaoi/api/db';
import { Helper } from '@sotaoi/api/helper';
import { RecordRef, AuthRecord } from '@sotaoi/omni/artifacts';
import { storage } from '@sotaoi/api/storage';
import { Asset } from '@sotaoi/omni/input';
import { AddressModel } from '@app/api/models/address-model';
import { UserModel } from '@app/api/models/user-model';
import { GenericModel } from '@sotaoi/api/models/generic-model';

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

    await new AddressModel().db().insertMany([
      {
        uuid: addressUuid,
        street: address.street.serialize(true),
        country: address.country.serialize(true),
      },
    ]);
    await new UserModel().db().insertMany([
      {
        uuid: userUuid,
        email: email.serialize(true),
        password: password.serialize(true),
        avatar: avatarAsset.serialize(true),
        gallery: Asset.serializeMulti(galleryAssets),
        flavor: flavor.serialize(true),
        address: new RecordRef('address', addressUuid).serialize(null),
      },
    ]);

    saveAvatar();
    saveGallery();

    const accessToken = Helper.uuid();
    const user = await new UserModel().db().findOne({ uuid: userUuid }).lean();
    const authRecord = new AuthRecord('user', userUuid, user.createdAt, true).setPocket({ accessToken });
    // better token encryption needed here
    await new GenericModel('access-token').db().insertMany([
      {
        uuid: Helper.uuid(),
        user: authRecord.serial,
        token: accessToken,
      },
    ]);
    this.handler.state('accessToken', accessToken);

    return new CommandResult(200, 'Hello', 'You are authenticated', authRecord, null);
  }
}

export { RegisterUserHandler };
