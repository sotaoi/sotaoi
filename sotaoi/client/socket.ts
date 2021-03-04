import { app } from '@sotaoi/client/app-kernel';
import { Socket } from '@sotaoi/client/contracts';

const socket = (): Socket => app().get<Socket>(Socket);

export { socket };
