#!/bin/env node

const { execSync } = require('child_process');
const path = require('path');

execSync('npm run stop:proxy:prod', { cwd: path.resolve('./app-proxy'), stdio: 'inherit' });
execSync('npm run stop:api:prod', { cwd: path.resolve('./app-api'), stdio: 'inherit' });
execSync('npm run stop:auth:prod', { cwd: path.resolve('./app-auth'), stdio: 'inherit' });
execSync('npm run stop:streaming:prod', { cwd: path.resolve('./app-streaming'), stdio: 'inherit' });
