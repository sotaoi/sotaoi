import { FormValidations } from '@sotaoi/omni/input';
import { validations } from '@app/omni/forms/validations';

const user: { [key: string]: () => Promise<FormValidations> } = {
  'user-register-form': async () => ({
    email: [...validations.user.email, { method: 'required' }],
    password: [...validations.user.password, { method: 'required' }],
    // todo mediumprio: add image type validation to validation fns
    // avatar: [{ method: 'required' }, { method: 'file', args: { type: 'image', maxSize: 1000000 } }],
    avatar: [],
    // gallery: [{ method: 'multiFile', args: { type: 'image', maxSize: 1000000 } }],
    // address: {
    //   fields: {
    //     street: [...validations.address.street, { method: 'required' }],
    //     country: [...validations.address.country, { method: 'required' }],
    //   },
    // },
  }),
  'user-update-form': async () => ({
    email: [...validations.user.email, { method: 'required' }],
    // todo mediumprio: add image type validation to validation fns
    avatar: [{ method: 'required' }, { method: 'file', args: { type: 'image', maxSize: 1000000 } }],
    // gallery: [{ method: 'multiFile', args: { type: 'image', maxSize: 1000000 } }],
    // address: {
    //   fields: {
    //     street: [...validations.address.street, { method: 'required' }],
    //     country: [...validations.address.country, { method: 'required' }],
    //   },
    // },
  }),
  'auth-user-form': async () => ({
    email: [{ method: 'required' }],
    password: [{ method: 'required' }],
  }),
};

export { user };
