import { app } from '@sotaoi/api/app-kernel';
import { Permissions } from '@sotaoi/api/contracts';

const permissions = (): Permissions => app().get<Permissions>(Permissions);

export { permissions };
