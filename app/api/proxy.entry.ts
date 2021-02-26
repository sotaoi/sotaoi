require('dotenv').config();
import { proxy } from '@sotaoi/api/proxy';
import { getAppInfo } from '@app/omni/get-app-info';

proxy(getAppInfo());
