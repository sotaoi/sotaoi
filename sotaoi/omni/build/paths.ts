import path from 'path';
import fs from 'fs';

// Make sure any symlinks in the project folder are resolved:
// https://github.com/facebook/create-react-app/issues/637
const rootPath = fs.realpathSync(path.resolve(process.cwd(), './'));
const resolveRoot = (relativePath: any): any => path.resolve(rootPath, relativePath);

const paths = {
  // client
  apiEntry: resolveRoot('./app/api/api.entry.ts'),
  cwebDevcomponent: resolveRoot('./app/client/cweb.devcomponent.tsx'),
  clientBuild: resolveRoot('./public/build'),
  clientHtml: resolveRoot('./public/index.html'),
  appApiPath: resolveRoot('./app/api'),
  appClientPath: resolveRoot('./app/client'),
  appOmniPath: resolveRoot('./app/omni'),
  sotaoiApiPath: resolveRoot('./sotaoi/api'),
  sotaoiClientPath: resolveRoot('./sotaoi/client'),
  sotaoiModulesPath: resolveRoot('./sotaoi/modules'),
  sotaoiOmniPath: resolveRoot('./sotaoi/omni'),
  appBuild: resolveRoot('./var/build/release'),
  appPath: resolveRoot('./app'),
  sotaoiPath: resolveRoot('./sotaoi'),
  nodeModulesPath: resolveRoot('./node_modules'),
  storagePath: resolveRoot('./storage'),
  phpPath: resolveRoot('./php'),
  //
  logsPath: resolveRoot('./logs'),
  publicPath: resolveRoot('./public'),
};

export { paths };
