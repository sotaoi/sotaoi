import { StoreHandler } from '@sotaoi/api/commands/store-handler';
import { CommandResult } from '@sotaoi/omni/transactions';
import { StoreCommand } from '@sotaoi/api/commands';
import { Helper } from '@sotaoi/api/helper';
import { Artifact } from '@sotaoi/omni/artifacts';
import { storage } from '@sotaoi/api/storage';
import { GenericModel } from '@sotaoi/api/db/generic-model';

class StorePostHandler extends StoreHandler {
  public getFormId = async (): Promise<string> => 'post-form';

  public async handle(command: StoreCommand): Promise<CommandResult> {
    const { title, content, user, category, image } = command.payload;
    const postUuid = Helper.uuid();
    const [saveImage, imageAsset, cancelImage] = storage('main').handle(
      { domain: 'public', pathname: ['post', postUuid, 'image.png'].join('/') },
      image,
    );

    await new GenericModel('post').db().insertMany([
      {
        uuid: postUuid,
        title: title.serialize(true),
        content: content.serialize(true),
        image: imageAsset.serialize(true),
        createdBy: user.serialize(true),
        category: category.serialize(true),
      },
    ]);

    saveImage();

    return new CommandResult(200, 'result', 'post added', new Artifact('post', postUuid), null);
  }
}

export { StorePostHandler };
