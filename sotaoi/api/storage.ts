import { app } from '@sotaoi/api/app-kernel';
import { Storage } from '@sotaoi/api/contracts';

type Drives = 'main';

const storage = (drive: Drives): Storage => {
  if (drive === 'main') {
    return app().get<Storage>(Storage);
  }
  throw new Error('drive not found');
};

export { storage };
export type { Drives };
