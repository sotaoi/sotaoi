#!/bin/env node

const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

const main = async (dirpath, noSubset) => {
  execSync('npm install --no-audit --no-fund', { stdio: 'inherit' });

  fs.readdirSync(dirpath).map((item) => {
    const fullpath = path.resolve(dirpath, item);
    if (!fs.lstatSync(fullpath).isDirectory()) {
      return;
    }
    if (item === 'packages') {
      !noSubset && main(fullpath, true);
      return;
    }
    if (fs.existsSync(path.resolve(fullpath, 'package.json'))) {
      bootstrap(path.resolve(fullpath, 'package.json'));
    }
  });
};

const bootstrap = (packageJsonPath) => {
  const dirpath = path.dirname(packageJsonPath);
  const packageJson = JSON.parse(fs.readFileSync(packageJsonPath).toString());

  if (packageJson.scripts?.bootstrap) {
    execSync('npm run bootstrap', { cwd: dirpath, stdio: 'inherit' });
    return;
  }
  if (fs.existsSync(path.resolve(dirpath, 'composer.json'))) {
    execSync('composer -n install', { cwd: dirpath, stdio: 'inherit' });
  }
  execSync('npm install --no-audit --no-fund', { cwd: dirpath, stdio: 'inherit' });
  execSync('git checkout -- ./package-lock.json', { cwd: dirpath, stdio: 'inherit' });
};

main(path.resolve('./'), false);
