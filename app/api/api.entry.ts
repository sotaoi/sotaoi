require('dotenv').config();
import { Server } from '@sotaoi/api/server';
import { handlers } from '@app/api/handlers';
import * as forms from '@app/omni/forms';
import { ApiInit } from '@app/api/api-init';

// app info
const appInfo = ApiInit.getInfo();

// app kernel
const appKernel = ApiInit.kernel();

// for automatic payload deserialization
ApiInit.registerInputs();

// translate access token
const translateAccessToken = ApiInit.translateAccessToken;

// deauth
const deauth = ApiInit.deauth;

// start
Server.init(appInfo, appKernel, handlers, forms, translateAccessToken, deauth);
