#!/bin/env node

const { execSync } = require('child_process');
const path = require('path');

execSync('npm run restart:api:prod', { cwd: path.resolve('./app-api'), stdio: 'inherit' });
