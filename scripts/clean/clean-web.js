#!/bin/env node

const { execSync } = require('child_process');
const path = require('path');

execSync('npm run clean:web', { cwd: path.resolve('./app-web'), stdio: 'inherit' });
