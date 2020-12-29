import { FormValidations } from '@sotaoi/omni/input';
import { validations } from '@app/omni/forms/validations';

const post: { [key: string]: () => Promise<FormValidations> } = {
  'post-form': async () => ({
    title: [...validations.post.title, { method: 'required' }],
    content: [...validations.post.content, { method: 'required' }],
    category: [],
    user: [],
    image: [{ method: 'required' }],
  }),
  'post-update-form': async () => ({
    title: [...validations.post.title, { method: 'required' }],
    content: [...validations.post.content, { method: 'required' }],
    category: [],
    user: [],
    image: [{ method: 'required' }],
  }),
};

export { post };
