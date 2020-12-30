import { CommandResult } from '@sotaoi/omni/transactions';
import { UpdateCommand } from '@sotaoi/api/commands';
import { db } from '@sotaoi/api/db';
import { Artifact } from '@sotaoi/omni/artifacts';
import { UpdateHandler } from '@sotaoi/api/commands/update-handler';
import { storage } from '@sotaoi/api/storage';

class UpdatePostHandler extends UpdateHandler {
  public getFormId = async (): Promise<string> => 'post-update-form';

  public async handle(command: UpdateCommand): Promise<CommandResult> {
    const { title, content, user, category, image } = command.payload;
    const [saveImage, imageAsset, cancelImage] = storage('main').handle(
      { domain: 'public', pathname: ['post', command.uuid, 'image.png'].join('/') },
      image,
    );
    await db('post')
      .update({
        title: title.serialize(true),
        content: content.serialize(true),
        image: imageAsset?.serialize(true) || null,

        createdBy: user.serialize(true),
        category: category.serialize(true),
      })
      .where('uuid', command.uuid);

    image ? saveImage() : cancelImage();

    return new CommandResult(
      true,
      {
        code: 200,
        title: 'Hello',
        msg: 'Command test',
        artifact: new Artifact('post', command.uuid),
      },
      null,
    );
  }
}

export { UpdatePostHandler };
