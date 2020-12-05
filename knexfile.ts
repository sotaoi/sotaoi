const { config } = require('@sotaoi/api/config');
const path = require('path');

const dbConfig = {
  ...config('db'),
  migrations: {
    directory: path.resolve(path.dirname(require.resolve('@app/api/package.json')), 'db', 'migrations'),
  },
  seeds: {
    directory: path.resolve(path.dirname(require.resolve('@app/api/package.json')), 'db', 'seeds'),
  },
};

module.exports = dbConfig;

export default dbConfig;
