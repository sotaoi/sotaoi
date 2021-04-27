import { CommandResult } from '@sotaoi/omni/transactions';
import { UpdateCommand } from '@sotaoi/api/commands';
import { Artifact } from '@sotaoi/omni/artifacts';
import { UpdateHandler } from '@sotaoi/api/commands/update-handler';
import { storage } from '@sotaoi/api/storage';
import { GenericModel } from '@sotaoi/api/db/generic-model';

class UpdatePostHandler extends UpdateHandler {
  public getFormId = async (): Promise<string> => 'post-update-form';

  public async handle(command: UpdateCommand): Promise<CommandResult> {
    const { title, content, user, category, image } = command.payload;
    const [saveImage, imageAsset, cancelImage] = storage('main').handle(
      { domain: 'public', pathname: ['post', command.uuid, 'image.png'].join('/') },
      image,
    );
    await new GenericModel('post').db().updateOne(
      { uuid: command.uuid },
      {
        title: title.serialize(true),
        content: content.serialize(true),
        image: imageAsset?.serialize(true) || null,

        createdBy: user.serialize(true),
        category: category.serialize(true),
      },
    );

    image ? saveImage() : cancelImage();

    return new CommandResult(200, 'Hello', 'Command test', new Artifact('post', command.uuid), null);
  }
}

export { UpdatePostHandler };
