typeof window === 'undefined' && require('dotenv').config();
import appInfo from '@app/omni/app-info.json';
import { AppInfo } from '@sotaoi/omni/state';

let appInfoParsed: AppInfo;

const envVarWhitelist = [
  'NODE_ENV',
  'APP_NAME',
  'BUNDLE_ID',
  'PACKAGE_NAME',
  'DEV_DOMAIN',
  'DEV_DOMAIN_ALIAS',
  'DEV_MOBILE_API_URL',
  'MOBILE_BUNDLE_LOCATION',
];

const processEnv = (): { [key: string]: string } => {
  const envVars: { [key: string]: string } = {};
  const processEnv = typeof process.env !== 'string' ? process.env : JSON.parse(process.env);
  if (typeof navigator !== 'undefined' && navigator.product === 'ReactNative') {
    //
  }
  for (const envVar of envVarWhitelist) {
    envVars[envVar] = processEnv[envVar] || '';
  }
  return envVars;
};

const getAppInfo = (): AppInfo => {
  if (appInfoParsed) {
    return appInfoParsed as AppInfo;
  }
  appInfoParsed = JSON.parse(JSON.stringify(appInfo));
  const envVars = processEnv();
  console.log(envVars);
  for (const key of Object.keys(appInfoParsed)) {
    for (const [varName, varVal] of Object.entries(envVars)) {
      (appInfoParsed as any)[key] =
        typeof (appInfoParsed as any)[key] === 'string'
          ? (appInfoParsed as any)[key].replace(new RegExp('%{' + varName + '}%', 'ig'), varVal || '')
          : (appInfoParsed as any)[key];
    }
  }
  return appInfoParsed;
};

export { getAppInfo, envVarWhitelist };
