#!/usr/bin/env node

require('dotenv').config();
const fs = require('fs');
const path = require('path');
const { exec } = require('child_process');
const tail = require('tail').Tail;
const express = require('express');
const https = require('https');
const { createProxyMiddleware } = require('http-proxy-middleware');

let serverInitInterval = null;
let serverInitTries = 0;

const log = console.log;

!fs.existsSync('./output.log') && fs.writeFileSync('./output.log', '');
const outputTail = new tail('./output.log');
outputTail.on('line', (data) => log(data));

exec('php artisan serve --host 0.0.0.0 --port 4001 >> ./output.log 2>&1', { cwd: path.resolve(__dirname, '../') });
const logTail = new tail(path.resolve('./storage/logs/laravel.log'));
logTail.on('line', (data) => log(data));

process.env.PORT = process.env.PORT || '4000';

const keyPath = path.resolve(process.env.SSL_KEY || '');
const certPath = path.resolve(process.env.SSL_CERT || '');
const chainPath = path.resolve(process.env.SSL_CA || '');

const main = async () => {
  clearTimeout(serverInitInterval);

  if (!fs.existsSync(keyPath) || !fs.existsSync(certPath) || !fs.existsSync(chainPath)) {
    if (serverInitTries === 60) {
      console.error('server failed to start because at least one ssl certificate file is missing');
      return;
    }
    serverInitTries++;
    console.warn('at least one certificate file is missing. retrying in 5 seconds...');
    serverInitInterval = setTimeout(async () => {
      await main(false);
    }, 5000);
    return;
  }

  const app = express();

  app.use(
    '/',
    createProxyMiddleware({
      secure: false,
      target: `http://localhost:4001`,
      ws: true,
      changeOrigin: false,
    }),
  );

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
    .listen(process.env.PORT || '4000');
};

main();
