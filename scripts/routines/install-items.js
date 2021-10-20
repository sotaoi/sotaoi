#!/bin/env node

const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

const installApps = (apps) => {
  for (const [appName, appDetails] of Object.entries(apps)) {
    if (!appDetails) {
      continue;
    }

    if (fs.existsSync(path.resolve(appName))) {
      continue;
    }
    try {
      execSync(`git clone ${appDetails.repo} ${appName}`, { cwd: path.resolve('./'), stdio: 'inherit' });
    } catch (err) {
      execSync(`git clone ${appDetails.repo.replace(':', '/').replace('git@', 'https://')} ${appName}`, {
        cwd: path.resolve('./'),
        stdio: 'inherit',
      });
    }
    try {
      execSync(`git checkout ${appDetails.version}`, {
        cwd: path.resolve(appName),
        stdio: 'inherit',
      });
    } catch (err) {
      console.warn(err);
    }
  }
};

const installPackages = (packages) => {
  !fs.existsSync(path.resolve('./packages')) && fs.mkdirSync('./packages');
  for (const [packageName, packageDetails] of Object.entries(packages)) {
    if (fs.existsSync(path.resolve('./packages', packageName))) {
      continue;
    }
    try {
      execSync(`git clone ${packageDetails.repo} ${packageName}`, {
        cwd: path.resolve('./packages'),
        stdio: 'inherit',
      });
    } catch (err) {
      execSync(`git clone ${packageDetails.repo.replace(':', '/').replace('git@', 'https://')} ${packageName}`, {
        cwd: path.resolve('./packages'),
        stdio: 'inherit',
      });
    }
    try {
      execSync(`git checkout ${packageDetails.version}`, {
        cwd: path.resolve('./packages', packageName),
        stdio: 'inherit',
      });
    } catch (err) {
      console.warn(err);
    }
  }
};

module.exports = { installApps, installPackages };
