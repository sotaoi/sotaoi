import { app } from '@sotaoi/client/app-kernel';
import { Lang } from '@sotaoi/client/contracts/lang';

const lang = (): Lang => app().get<Lang>(Lang);

export { lang };
