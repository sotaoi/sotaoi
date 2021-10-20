#!/bin/env node

const { execSync } = require('child_process');
const path = require('path');

execSync('npm run db:rollback', { cwd: path.resolve('./app-api'), stdio: 'inherit' });
