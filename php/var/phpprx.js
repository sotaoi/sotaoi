#!/usr/bin/env node

require('dotenv').config();
const fs = require('fs');
const path = require('path');
const { exec } = require('child_process');
const tail = require('tail').Tail;

const log = console.log;

!fs.existsSync('./output.log') && fs.writeFileSync('./output.log', '');
const outputTail = new tail('./output.log');
outputTail.on('line', (data) => log(data));

exec('php artisan serve --host 0.0.0.0 --port 4001 >> ./output.log 2>&1', { cwd: path.resolve(__dirname, '../') });
const logTail = new tail(path.resolve('./storage/logs/laravel.log'));
logTail.on('line', (data) => log(data));

// exec('npm run watch >> ./output.log 2>&1', { cwd: path.resolve(__dirname, '../') });

const runSchedule = () =>
  exec('php artisan schedule:run >> ./output.log 2>&1', { cwd: path.resolve(__dirname, '../') });
setInterval(() => runSchedule(), 60000);
runSchedule();

const express = require('express');
const https = require('https');
const { createProxyMiddleware } = require('http-proxy-middleware');

process.env.PORT = process.env.PORT || '4000';

const main = async () => {
  const app = express();
  const keyPath = path.resolve(process.env.SSL_KEY || '');
  const certPath = path.resolve(process.env.SSL_CERT || '');
  const chainPath = path.resolve(process.env.SSL_CA || '');

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
