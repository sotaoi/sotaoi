import { StoreHandler } from '@sotaoi/api/commands/store-handler';
import { CommandResult } from '@sotaoi/omni/transactions';
import { StoreCommand } from '@sotaoi/api/commands';
import { db } from '@sotaoi/api/db';
import { Helper } from '@sotaoi/api/helper';
import { Artifact } from '@sotaoi/omni/artifacts';
import { storage } from '@sotaoi/api/storage';

class StorePostHandler extends StoreHandler {
  public getFormId = async (): Promise<string> => 'post-form';

  public async handle(command: StoreCommand): Promise<CommandResult> {
    const { title, content, user, category, image } = command.payload;
    const postUuid = Helper.uuid();
    const [saveImage, imageAsset, cancelImage] = storage('main').handle(
      { domain: 'public', pathname: ['post', postUuid, 'image.png'].join('/') },
      image,
    );
    await db('post').insert({
      uuid: postUuid,
      title: title.serialize(true),
      content: content.serialize(true),
      image: imageAsset?.serialize(true) || null,

      createdBy: user.serialize(true),
      category: category.serialize(true),
    });
    saveImage();
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
