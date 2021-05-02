require('dotenv').config();
import { proxy } from '@sotaoi/api/proxy';
import { getAppInfo, getAppDomain } from '@app/omni/get-app-info';
import yargs from 'yargs';

const argv = yargs
  .option('testserver', {
    description: 'Start non https express on port 80',
    type: 'boolean',
  })
  .help()
  .alias('help', 'h').argv;

proxy(getAppInfo(), getAppDomain(), !!argv.testserver);
