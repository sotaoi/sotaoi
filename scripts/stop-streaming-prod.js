#!/bin/env node

const { execSync } = require('child_process');
const path = require('path');

execSync('npm run stop:streaming:prod', { cwd: path.resolve('./app-streaming'), stdio: 'inherit' });
