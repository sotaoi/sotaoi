import { app } from '@sotaoi/api/app-kernel';
import { Storage } from '@sotaoi/api/contracts';

const storage = (drive: string): Storage => {
  if (drive === 'main') {
    return app().get<Storage>(Storage);
  }
  throw new Error('drive not found');
};

export { storage };
