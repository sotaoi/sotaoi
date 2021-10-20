#!/bin/env node

const { execSync } = require('child_process');
const path = require('path');

execSync('npm run install:rnsdk', { cwd: path.resolve('./app-mobile'), stdio: 'inherit' });
