#!/bin/env node

const { exec } = require('child_process');

const main = async () => {
  exec('tail -f ./app-api/logs/*.log').stdout.pipe(process.stdout);
  exec('tail -f ./app-auth/logs/*.log').stdout.pipe(process.stdout);
  exec('tail -f ./app-php/logs/apache/*.log').stdout.pipe(process.stdout);
  exec('tail -f ./app-php/storage/logs/*.log').stdout.pipe(process.stdout);
  exec('tail -f ./app-proxy/logs/*.log').stdout.pipe(process.stdout);
  exec('tail -f ./app-streaming/logs/*.log').stdout.pipe(process.stdout);
  exec('tail -f ./app-web/server-output.log').stdout.pipe(process.stdout);
};

main();
