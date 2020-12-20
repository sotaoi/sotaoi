import { FormValidations } from '@sotaoi/omni/input';
import { validations } from '@app/omni/forms/validations';

const post: { [key: string]: () => Promise<FormValidations> } = {
  'post-form': async () => ({
    title: [...validations.post.title],
    content: [...validations.post.content],
    category: [],
    user: [],
  }),
};

export { post };
