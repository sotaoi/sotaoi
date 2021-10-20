#!/bin/env node

const { execSync } = require('child_process');
const path = require('path');

execSync('npm run ssl:greenlock', { cwd: path.resolve('./app-proxy'), stdio: 'inherit' });
