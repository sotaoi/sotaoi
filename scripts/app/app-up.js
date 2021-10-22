#!/bin/env node

const { execSync } = require('child_process');
const path = require('path');

execSync('npm run app:up', { cwd: path.resolve('./app-proxy'), stdio: 'inherit' });
