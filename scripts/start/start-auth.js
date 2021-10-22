#!/bin/env node

const { execSync } = require('child_process');
const path = require('path');

execSync('npm run start:auth', { cwd: path.resolve('./app-auth'), stdio: 'inherit' });
