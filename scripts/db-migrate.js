#!/bin/env node

const { execSync } = require('child_process');
const path = require('path');

execSync('npm run db:migrate', { cwd: path.resolve('./app-api'), stdio: 'inherit' });
