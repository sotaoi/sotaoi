import { FormValidations } from '@sotaoi/omni/input';
import { validations } from '@app/omni/forms/validations';

const user: { [key: string]: () => Promise<FormValidations> } = {
  'user-command-form': async () => ({
    email: [...validations.user.email, { method: 'required' }],
    password: [...validations.user.password, { method: 'required' }],
    avatar: [],
    address: {
      fields: {
        street: [...validations.address.street, { method: 'required' }],
        country: [...validations.address.country, { method: 'required' }],
      },
    },
  }),
  'auth-user-form': async () => ({
    email: [{ method: 'required' }],
    password: [{ method: 'required' }],
  }),
  'user-hello-task': async () => ({
    param1: [{ method: 'required' }],
    param2: [{ method: 'required' }],
  }),
};

export { user };
