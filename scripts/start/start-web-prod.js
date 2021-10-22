#!/bin/env node

const { execSync } = require('child_process');
const path = require('path');

execSync('npm run start:web:prod', { cwd: path.resolve('./app-web'), stdio: 'inherit' });
