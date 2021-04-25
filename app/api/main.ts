require('dotenv').config();
import fs from 'fs';
import path from 'path';
import { Server } from '@sotaoi/api/server';
import { handlers } from '@app/api/handlers';
import * as forms from '@app/omni/forms';
import { ApiInit } from '@app/api/api-init';
import { getAppInfo } from '@app/omni/get-app-info';
import { AddressModel } from '@app/api/models/address-model';
import { UserModel } from '@app/api/models/user-model';
import { CountryModel } from '@app/api/models/country-model';
import { connect } from '@sotaoi/api/db';

let serverInitInterval: any = null;
let serverInitTries = 0;

const main = async (noServer: boolean): Promise<void> => {
  clearTimeout(serverInitInterval);
  const keyPath = path.resolve(process.env.SSL_KEY || '');
  const certPath = path.resolve(process.env.SSL_CERT || '');
  const chainPath = path.resolve(process.env.SSL_CA || '');
  if (!noServer && (!fs.existsSync(keyPath) || !fs.existsSync(certPath) || !fs.existsSync(chainPath))) {
    if (serverInitTries === 60) {
      console.error('server failed to start because at least one ssl certificate file is missing');
      return;
    }
    serverInitTries++;
    console.warn('at least one certificate file is missing. retrying in 5 seconds...');
    serverInitInterval = setTimeout(async (): Promise<void> => {
      await main(false);
    }, 5000);
    return;
  }

  // app info
  const appInfo = getAppInfo();

  // app kernel
  const appKernel = ApiInit.kernel();

  // for automatic payload deserialization
  ApiInit.registerInputs();

  // translate access token
  const translateAccessToken = ApiInit.translateAccessToken;

  // deauth
  const deauth = ApiInit.deauth;

  // models
  const models = {
    address: new AddressModel(),
    country: new CountryModel(),
    user: new UserModel(),
  };

  await connect();

  // start
  await Server.init(noServer, appInfo, appKernel, handlers, models, forms, translateAccessToken, deauth);
};

export { main };
