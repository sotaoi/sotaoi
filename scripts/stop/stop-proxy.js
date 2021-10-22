#!/bin/env node

const { execSync } = require('child_process');
const path = require('path');

execSync('npm run stop:proxy', { cwd: path.resolve('./app-proxy'), stdio: 'inherit' });
