import path from 'path';
import fs from 'fs';

// Make sure any symlinks in the project folder are resolved:
// https://github.com/facebook/create-react-app/issues/637
const rootPath = fs.realpathSync(path.resolve(process.cwd(), './'));
const resolveRoot = (relativePath: any): any => path.resolve(rootPath, relativePath);

const paths = {
  // client
  apiEntry: resolveRoot('./app/api/api.entry.ts'),
  cwebEntry: resolveRoot('./app/client/cweb.entry.tsx'),
  clientBuild: resolveRoot('./app/client/build'),
  clientPublic: resolveRoot('./app/client/public'),
  clientHtml: resolveRoot('./app/client/public/index.html'),
  appApiPath: resolveRoot('./app/api'),
  appClientPath: resolveRoot('./app/client'),
  appOmniPath: resolveRoot('./app/omni'),
  sotaoiApiPath: resolveRoot('./sotaoi/api'),
  sotaoiClientPath: resolveRoot('./sotaoi/client'),
  sotaoiOmniPath: resolveRoot('./sotaoi/omni'),
  // api
  apiBuild: resolveRoot('./var/build/release'),
  appPath: resolveRoot('./app'),
  sotaoiPath: resolveRoot('./sotaoi'),
  // general
  nodeModulesPath: resolveRoot('./node_modules'),
};

export { paths };
