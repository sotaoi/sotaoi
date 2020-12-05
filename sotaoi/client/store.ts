import { app } from '@sotaoi/client/app-kernel';
import { Store } from '@sotaoi/client/contracts';

const store = (): Store => app().get<Store>(Store);

export { store };
