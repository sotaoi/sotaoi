#!/bin/env node

const { execSync } = require('child_process');
const path = require('path');

const main = async () => {
  execSync('npm run app:config', { cwd: path.resolve('./app-proxy'), stdio: 'inherit' });
};

main();
