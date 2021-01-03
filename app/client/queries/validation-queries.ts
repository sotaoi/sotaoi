import { RequestAbortHandler } from '@sotaoi/client/components';
import { FormValidations } from '@sotaoi/omni/input';
import { user, post } from '@app/omni/forms';

const getUserStoreFormValidations = () => {
  return (props: { [key: string]: any }, requestAbortHandler: RequestAbortHandler): Promise<FormValidations> =>
    user['user-register-form']();
};

const getUserUpdateFormValidations = () => {
  return (props: { [key: string]: any }, requestAbortHandler: RequestAbortHandler): Promise<FormValidations> =>
    user['user-update-form']();
};

const getAuthUserFormValidations = () => {
  return (props: { [key: string]: any }, requestAbortHandler: RequestAbortHandler): Promise<FormValidations> =>
    user['auth-user-form']();
};

const getUserHelloTaskValidations = () => {
  return (props: { [key: string]: any }, requestAbortHandler: RequestAbortHandler): Promise<FormValidations> =>
    user['user-hello-task']();
};

const getPostFormValidations = () => {
  return (props: { [key: string]: any }, requestAbortHandler: RequestAbortHandler): Promise<FormValidations> =>
    post['post-form']();
};

export {
  getAuthUserFormValidations,
  getUserStoreFormValidations,
  getUserUpdateFormValidations,
  getUserHelloTaskValidations,
  getPostFormValidations,
};
