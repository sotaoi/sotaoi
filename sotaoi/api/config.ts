require('dotenv').config();
import fs from 'fs';
import path from 'path';

const configPath = path.resolve(__dirname, './config');
const configs: { [key: string]: any } = {};

fs.readdirSync(configPath).map((configFile) => {
  const configName = configFile.substr(0, configFile.length - 3);
  if (!configName.length) {
    return;
  }
  const config = require(path.resolve(configPath, configFile));
  configs[configName] = config;
});

const config = (key: string): any => {
  try {
    const keyArray = key.toLowerCase().split('.');
    const file: string | undefined = keyArray.shift();
    if (!file) {
      return null;
    }
    let cfg: any = configs[file];
    if (!cfg) {
      return null;
    }
    for (const key of keyArray) {
      cfg = cfg[key];
      if (typeof cfg === 'undefined') {
        return null;
      }
    }
    return cfg;
  } catch (err) {
    return null;
  }
};

export { config };
