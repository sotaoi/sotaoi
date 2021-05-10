require('dotenv').config();
//
import fs from 'fs';
import path from 'path';
import webpack from 'webpack';
import WebpackDevServer from 'webpack-dev-server';
import { WebpackConfigFactory, getBundleJson } from '@sotaoi/omni/build/client.webpack.config';
import { paths } from '@sotaoi/omni/build/paths';
import yargs from 'yargs';
import express from 'express';
import https from 'https';

const main = async (): Promise<void> => {
  const argv = yargs
    .option('info', {
      alias: 'i',
      description: 'File path for app app-info.json',
      type: 'string',
    })
    .help()
    .alias('help', 'h').argv;

  if (!argv.servebuild) {
    throw new Error('--servebuild is required (--servebuild yes / --servebuild no)');
  }

  let serverInitInterval: any = null;
  let serverInitTries = 0;
  let bundleInstallInterval: any = null;
  const PORT = '8080';
  const HOST = '0.0.0.0';

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
    console.warn('at least one certificate file is missing. retrying in 5 seconds...');
    serverInitInterval = setTimeout(async (): Promise<void> => {
      await main();
    }, 5000);
    return;
  }

  if (argv.servebuild === 'yes') {
    const app = express();
    const publicPath = path.resolve('./public');

    app.get('*', function (req: any, res: any) {
      res.sendFile(publicPath + '/index.html');
    });

    https
      .createServer(
        {
          key: fs.readFileSync(keyPath),
          cert: fs.readFileSync(certPath),
          ca: fs.readFileSync(chainPath),
          rejectUnauthorized: false,
        },
        app,
      )
      .listen(PORT);

    return;
  }

  const config = WebpackConfigFactory('development');

  const compiler = webpack(config);

  const devServer = new WebpackDevServer(compiler, {
    sockPort: PORT,
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

  devServer.listen(parseInt(PORT), HOST);

  !getBundleJson().installed &&
    (bundleInstallInterval = setInterval(() => {
      const BundleJson = getBundleJson();
      if (!BundleJson.installed) {
        return;
      }
      clearInterval(bundleInstallInterval);
      devServer.close();
      main();
    }, 3000));
};

main();
