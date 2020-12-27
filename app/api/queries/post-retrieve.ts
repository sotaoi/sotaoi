import { RetrieveHandler } from '@sotaoi/api/queries/retrieve-handler';
import { RetrieveResult } from '@sotaoi/omni/transactions';
import { Retrieve } from '@sotaoi/omni/transactions';
import { db } from '@sotaoi/api/db';
import { storage } from '@sotaoi/api/storage';

class PostRetrieve extends RetrieveHandler {
  public async handle(retrieve: Retrieve): Promise<RetrieveResult> {
    try {
      const post = await db('post').where('uuid', retrieve.uuid).first();
      const image = JSON.parse(post.image);
      console.log(image);
      // const [saveImage, imageAsset, cancelImage] = storage('main').handle(
      //   { domain: 'public', pathname: ['post', post.uuid, 'image.png'].join('/') },
      //   image,
      // );
      // post.image = `/api/storage/${imageAsset.drive}/assets/${imageAsset.domain}/${imageAsset.pathname}`;
      const category = await db('category').where('uuid', JSON.parse(post.category).uuid).first();
      post.category = category.name;
      const user = await db('user').where('uuid', JSON.parse(post.createdBy).uuid).first();
      post.userName = user.email;

      if (!post) {
        const error = new Error('Retrieve failed');
        error.message = 'Not found';
        throw error;
      }
      return new RetrieveResult(
        true,
        {
          code: 200,
          title: 'Retrieve success',
          msg: 'Retrieve was successful',
          record: post,
        },
        null,
      );
    } catch (err) {
      return new RetrieveResult(false, null, {
        code: 400,
        title: 'Error',
        msg: 'Retrieve failed',
        validations: null,
      });
    }
  }
}

export { PostRetrieve };
