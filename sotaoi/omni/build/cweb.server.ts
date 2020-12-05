process.env.NODE_ENV = 'development';

import fs from 'fs';
import path from 'path';
import webpack from 'webpack';
import WebpackDevServer from 'webpack-dev-server';
import { WebpackConfigFactory } from '@sotaoi/omni/build/client.webpack.config';
import { paths } from '@sotaoi/omni/build/paths';
import yargs from 'yargs';

const main = async (): Promise<void> => {
  const argv = yargs
    .option('info', {
      alias: 'i',
      description: 'File path for app info.json',
      type: 'string',
    })
    .help()
    .alias('help', 'h').argv;

  if (!argv.info) {
    throw new Error('File path for app info.json is missing. --info is required');
  }
  const info = JSON.parse(fs.readFileSync(path.resolve(argv.info)).toString());

  const PORT = info.devClientPort;
  const HOST = process.env.HOST || '0.0.0.0';

  const config = WebpackConfigFactory('development');

  const compiler = webpack(config);

  const devServer = new WebpackDevServer(compiler, {
    sockPort: 8080,
    compress: false,
    contentBase: paths.clientPublic,
    watchContentBase: true,
    publicPath: '/',
    watchOptions: {
      ignored: path.resolve('node_modules'),
      poll: true,
    },
    https: {
      key: fs.readFileSync('./sotaoi/api/certs/privkey.pem'),
      cert: fs.readFileSync('./sotaoi/api/certs/fullchain.pem'),
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
