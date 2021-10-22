#!/bin/env node

const { execSync } = require('child_process');
const path = require('path');

execSync('npm run shell:clear-mc', { cwd: path.resolve('./app-mobile'), stdio: 'inherit' });
