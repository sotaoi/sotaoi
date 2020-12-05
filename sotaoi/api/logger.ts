import { app } from '@sotaoi/api/app-kernel';
import { Logger } from '@sotaoi/api/contracts';

const logger = (): Logger => app().get<Logger>(Logger);

export { logger };
