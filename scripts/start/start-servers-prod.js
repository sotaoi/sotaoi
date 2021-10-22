#!/bin/env node

const { execSync } = require('child_process');
const path = require('path');

execSync('npm run start:proxy:prod', { cwd: path.resolve('./app-proxy'), stdio: 'inherit' });
execSync('npm run start:api:prod', { cwd: path.resolve('./app-api'), stdio: 'inherit' });
execSync('npm run start:auth:prod', { cwd: path.resolve('./app-auth'), stdio: 'inherit' });
execSync('npm run start:streaming:prod', { cwd: path.resolve('./app-streaming'), stdio: 'inherit' });
