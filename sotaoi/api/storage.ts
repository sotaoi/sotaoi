import { app } from '@sotaoi/api/app-kernel';
import { Storage } from '@sotaoi/api/contracts';

const storage = (): Storage => app().get<Storage>(Storage);

export { storage };
