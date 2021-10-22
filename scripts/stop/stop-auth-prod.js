#!/bin/env node

const { execSync } = require('child_process');
const path = require('path');

execSync('npm run stop:auth:prod', { cwd: path.resolve('./app-auth'), stdio: 'inherit' });
