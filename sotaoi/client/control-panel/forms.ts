import { FormValidations } from '@sotaoi/omni/input';

const controlPanel: { [key: string]: () => Promise<FormValidations> } = {
  'set-install-status-task': async () => ({}),
};

export { controlPanel };
