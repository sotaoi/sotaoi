require('dotenv').config();

import express from 'express';
import path from 'path';
import https from 'https';
import fs from 'fs';

let serverInitInterval: any = null;
let serverInitTries = 0;

const main = async (): Promise<void> => {
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

  const app = express();
  const publicPath = path.resolve(__dirname, 'build');

  app.use(express.static(publicPath));
  app.get('*', function (req: any, res: any) {
    res.sendFile(publicPath + '/index.html');
  });

  https
    .createServer(
      {
        key: fs.readFileSync('./sotaoi/api/certs/privkey.pem'),
        cert: fs.readFileSync('./sotaoi/api/certs/cert.pem'),
        ca: fs.readFileSync('./sotaoi/api/certs/bundle.pem'),
        rejectUnauthorized: false,
      },
      app,
    )
    .listen(process.env.PORT || '8080');
};

main();
