#!/bin/env node

const { spawn, execSync } = require('child_process');
const path = require('path');

let exitHandled = false;

const exitHandler = () => {
  if (exitHandled) {
    return;
  }
  // shut down
  execSync('npm run stop:proxy', { cwd: path.resolve('./app-proxy'), stdio: 'inherit' });
  exitHandled = true;
  process.exitCode = 0;
};
process.on('exit', exitHandler.bind(null, { code: 0 }));
process.on('SIGINT', exitHandler.bind(null, { code: 0 }));
process.on('SIGTERM', exitHandler.bind(null, { code: 0 }));
process.on('SIGQUIT', exitHandler.bind(null, { code: 0 }));
process.on('SIGUSR1', exitHandler.bind(null, { code: 0 }));
// process.on('SIGUSR2', exitHandler.bind(null, { code: 0 })); // <-- this is nodemon
// process.on('uncaughtException', exitHandler.bind(null, { code: 1 })); // <-- you don't want shutdown on uncaughtException

const main = async () => {
  execSync('npm run stop:proxy', { cwd: path.resolve('./app-proxy'), stdio: 'ignore' });
  spawn('npm', ['run', 'start:proxy'], { cwd: path.resolve('./app-proxy'), stdio: 'inherit' });
  spawn('npm', ['run', 'start:api'], { cwd: path.resolve('./app-api'), stdio: 'inherit' });
  spawn('npm', ['run', 'start:auth'], { cwd: path.resolve('./app-auth'), stdio: 'inherit' });
  spawn('npm', ['run', 'start:php'], { cwd: path.resolve('./app-php'), stdio: 'inherit' });
  spawn('npm', ['run', 'start:streaming'], { cwd: path.resolve('./app-streaming'), stdio: 'inherit' });
};

main();
