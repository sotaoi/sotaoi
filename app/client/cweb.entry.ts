process.env.NODE_ENV = 'development';

import fs from 'fs';
import path from 'path';
import webpack from 'webpack';
import WebpackDevServer from 'webpack-dev-server';
import { WebpackConfigFactory } from '@sotaoi/omni/build/client.webpack.config';
import { paths } from '@sotaoi/omni/build/paths';
import yargs from 'yargs';

let serverInitInterval: any = null;
let serverInitTries = 0;

const main = async (): Promise<void> => {
  const argv = yargs
    .option('info', {
      alias: 'i',
      description: 'File path for app app-info.json',
      type: 'string',
    })
    .help()
    .alias('help', 'h').argv;

  clearTimeout(serverInitInterval);
  const keyPath = path.resolve(process.env.SSL_KEY || '');
  const certPath = path.resolve(process.env.SSL_CERT || '');
  const chainPath = path.resolve(process.env.SSL_CA || '');
  if (!fs.existsSync(keyPath) || !fs.existsSync(certPath) || !fs.existsSync(chainPath)) {
    if (serverInitTries === 60) {
      console.error('server failed to start because at least one ssl certificate file is missing');
      return;
    }
    serverInitTries++;
    console.error('at least one certificate file is missing. retrying in 5 seconds...');
    serverInitInterval = setTimeout(async (): Promise<void> => {
      await main();
    }, 5000);
    return;
  }

  if (!argv.info) {
    throw new Error('File path for app app-info.json is missing. --info is required');
  }
  const info = JSON.parse(fs.readFileSync(path.resolve(argv.info)).toString());

  const PORT = info.devClientPort;
  const HOST = process.env.HOST || '0.0.0.0';

  const config = WebpackConfigFactory('development');

  const compiler = webpack(config);

  const devServer = new WebpackDevServer(compiler, {
    sockPort: 8080,
    compress: false,
    contentBase: paths.publicPath,
    watchContentBase: true,
    publicPath: '/',
    watchOptions: {
      ignored: [
        path.resolve('./node_modules'),
        path.resolve('./php'),
        path.resolve('./storage/app'),
        path.resolve('./storage/framework'),
        path.resolve('./storage/logs'),
      ],
      poll: true,
    },
    https: {
      key: fs.readFileSync(keyPath),
      cert: fs.readFileSync(certPath),
      ca: fs.readFileSync(chainPath),
    },
    host: HOST,
    overlay: false,
    historyApiFallback: {
      disableDotRule: true,
    },
    public: '0.0.0.0',
    disableHostCheck: true,
  });

  devServer.listen(PORT, HOST);
};

main();
