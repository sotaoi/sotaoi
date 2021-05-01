import { app } from '@sotaoi/client/app-kernel';
import { Logger } from '@sotaoi/client/contracts';

const logger = (): Logger => app().get<Logger>(Logger);

export { logger };
