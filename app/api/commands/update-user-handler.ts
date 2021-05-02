import { CommandResult } from '@sotaoi/omni/transactions';
import { UpdateCommand } from '@sotaoi/api/commands';
import { Artifact } from '@sotaoi/omni/artifacts';
import { UpdateHandler } from '@sotaoi/api/commands/update-handler';
import { storage } from '@sotaoi/api/storage';
// import { Asset } from '@sotaoi/omni/input';
import { UserModel } from '@app/api/models/user-model';
// import { AddressModel } from '@app/api/models/address-model';

class UpdateUserHandler extends UpdateHandler {
  public getFormId = async (): Promise<string> => 'user-update-form';

  public async handle(command: UpdateCommand): Promise<CommandResult> {
    // const { email, avatar, gallery, address } = command.payload;
    const { email, avatar } = command.payload;

    // const addressUuid = JSON.parse((await new UserModel().db().findOne({ uuid: command.uuid }).lean()).address).uuid;
    const [saveAvatar, avatarAsset, removeAvatar] = storage('main').handle(
      {
        domain: 'public',
        pathname: ['user', command.uuid, 'avatar.png'].join('/'),
      },
      avatar,
    );
    // const [saveGallery, galleryAssets, removeGallery] = storage('main').multiHandle(
    //   {
    //     domain: 'public',
    //     pathname: ['user', command.uuid, 'gallery'].join('/'),
    //   },
    //   gallery,
    // );

    // if (!addressUuid) {
    //   throw new Error('something went wrong - failed to fetch address for user while updating');
    // }
    // await new AddressModel().db().updateOne(
    //   { uuid: addressUuid },
    //   {
    //     street: address.street.serialize(true),
    //     country: address.country.serialize(true),
    //   },
    // );

    await new UserModel().db().updateOne(
      { uuid: command.uuid },
      {
        email: email.serialize(true),
        avatar: avatarAsset.serialize(true),
        // gallery: Asset.serializeMulti(galleryAssets),
      },
    );

    avatar ? saveAvatar() : removeAvatar();

    // gallery ? saveGallery() : removeGallery();

    return new CommandResult(200, 'Hello', 'Command test', new Artifact('user', command.uuid), null);
  }
}

export { UpdateUserHandler };
