#!/bin/env node

const { execSync } = require('child_process');
const path = require('path');

execSync('npm run start:php', { cwd: path.resolve('./app-php'), stdio: 'inherit' });
