import { FieldValidation } from '@sotaoi/omni/input';

const validations: { [key: string]: { [key: string]: FieldValidation[] } } = {
  generic: {
    image: [{ method: 'image' }],
  },
  user: {
    email: [{ method: 'email' }],
    password: [{ method: 'min', args: { length: 6 } }],
  },
  post: {
    title: [{ method: 'title' }],
    content: [{ method: 'content' }],
    category: [{ method: 'ref', args: { repository: 'category' } }],
    user: [{ method: 'ref', args: { repository: 'user' } }],
  },
  review: {
    title: [{ method: 'title' }],
    content: [{ method: 'content' }],
  },
  address: {
    street: [{ method: 'street' }],
    country: [{ method: 'ref', args: { repository: 'country' } }],
  },
};

export { validations };
