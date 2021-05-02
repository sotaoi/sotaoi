typeof window === 'undefined' && require('dotenv').config();
import appInfo from '@app/omni/app-info.json';
import { envVarWhitelist } from '@sotaoi/omni/app-package.json';
import { AppInfo } from '@sotaoi/omni/state';

let appInfoParsed: AppInfo;

const processEnv = (): { [key: string]: string } => {
  const envVars: { [key: string]: string } = {};
  const processEnv = typeof process.env !== 'string' ? process.env : JSON.parse(process.env);
  if (typeof navigator !== 'undefined' && navigator.product === 'ReactNative') {
    envVars.NODE_ENV = process.env.NODE_ENV || '';
    envVars.APP_NAME = process.env.APP_NAME || '';
    envVars.BUNDLE_ID = process.env.BUNDLE_ID || '';
    envVars.PACKAGE_NAME = process.env.PACKAGE_NAME || '';
    envVars.LOCAL_DOMAIN = process.env.LOCAL_DOMAIN || '';
    envVars.LOCAL_DOMAIN_ALIAS = process.env.LOCAL_DOMAIN_ALIAS || '';
    envVars.DEV_DOMAIN = process.env.DEV_DOMAIN || '';
    envVars.DEV_DOMAIN_ALIAS = process.env.DEV_DOMAIN_ALIAS || '';
    envVars.STAGE_DOMAIN = process.env.STAGE_DOMAIN || '';
    envVars.STAGE_DOMAIN_ALIAS = process.env.STAGE_DOMAIN_ALIAS || '';
    envVars.PROD_DOMAIN = process.env.PROD_DOMAIN || '';
    envVars.PROD_DOMAIN_ALIAS = process.env.PROD_DOMAIN_ALIAS || '';
    envVars.MOBILE_BUNDLE_LOCATION = process.env.MOBILE_BUNDLE_LOCATION || '';
    envVars.GREENLOCK_EXECUTION = process.env.GREENLOCK_EXECUTION || '';
    envVars.SSL_MAINTAINER = process.env.SSL_MAINTAINER || '';
    return envVars;
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

const getAppDomain = (): string => {
  const appInfo = getAppInfo();
  switch (process.env.NODE_ENV) {
    case 'production':
      return appInfo.prodDomain;
    case 'staging':
      return appInfo.stageDomain;
    case 'development':
      return appInfo.devDomain;
    default:
      return appInfo.localDomain;
  }
};

export { getAppInfo, getAppDomain, envVarWhitelist };
