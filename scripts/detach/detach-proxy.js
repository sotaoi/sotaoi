#!/bin/env node

const { execSync } = require('child_process');
const path = require('path');

let exitHandled = false;
let processInterval = null;

processInterval = setInterval(() => {
  false && console.info(false);
}, 10000);

execSync('npm run start:proxy', { cwd: path.resolve('./app-proxy'), stdio: 'ignore' });

process.stdin.resume();
const exitHandler = () => {
  if (exitHandled) {
    return;
  }
  // shut down
  try {
    execSync('npm run stop:proxy', { cwd: path.resolve('./app-proxy'), stdio: 'inherit' });
  } catch (err) {
    // do nothing
  }
  clearInterval(processInterval);
  process.exit(0);
};
process.on('exit', exitHandler.bind(null, { code: 0 }));
process.on('SIGINT', exitHandler.bind(null, { code: 0 }));
process.on('SIGTERM', exitHandler.bind(null, { code: 0 }));
process.on('SIGQUIT', exitHandler.bind(null, { code: 0 }));
process.on('SIGUSR1', exitHandler.bind(null, { code: 0 }));
// process.on('SIGUSR2', exitHandler.bind(null, { code: 0 })); // <-- this is nodemon
// process.on('uncaughtException', exitHandler.bind(null, { code: 1 })); // <-- you don't want shutdown on uncaughtException
