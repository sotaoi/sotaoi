#!/bin/env node

const { execSync } = require('child_process');
const path = require('path');

execSync('npm run start:proxy:prod', { cwd: path.resolve('./app-proxy'), stdio: 'inherit' });
