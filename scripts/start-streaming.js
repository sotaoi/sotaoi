#!/bin/env node

const { execSync } = require('child_process');
const path = require('path');

execSync('npm run start:streaming', { cwd: path.resolve('./app-streaming'), stdio: 'inherit' });
