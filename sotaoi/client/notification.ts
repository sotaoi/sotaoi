import { app } from '@sotaoi/client/app-kernel';
import { Notification } from '@sotaoi/client/contracts';

const notification = (): Notification => app().get<Notification>(Notification);

export { notification };
