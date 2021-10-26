#!/bin/env node

const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

const log = console.log;

const pushAllApps = (apps) => {
  for (const appName of Object.keys(apps)) {
    if (!fs.existsSync(path.resolve(appName))) {
      continue;
    }
    try {
      log('Running git push in directory: ', path.resolve(appName));
      execSync(`git add --all && git commit -m 'refactor: update' && git push`, {
        cwd: path.resolve(appName),
        stdio: 'inherit',
      });
    } catch (err) {
      // console.error(err);
    }
    log('\n---------------------------\n');
  }
};

const pushAllPackages = (packages) => {
  for (const packageName of Object.keys(packages)) {
    if (!fs.existsSync(path.resolve('./packages', packageName))) {
      continue;
    }
    try {
      log('Running git push in directory: ', path.resolve('./packages', packageName));
      execSync(`git add --all && git commit -m 'refactor: update' && git push`, {
        cwd: path.resolve('./packages', packageName),
        stdio: 'inherit',
      });
    } catch (err) {
      // console.error(err);
    }
    log('\n---------------------------\n');
  }
};

const statusAllApps = (apps) => {
  for (const appName of Object.keys(apps)) {
    if (!fs.existsSync(path.resolve(appName))) {
      continue;
    }
    log('Running git status in directory: ', path.resolve(appName));
    execSync(`git status`, {
      cwd: path.resolve(appName),
      stdio: 'inherit',
    });
    log('\n---------------------------\n');
  }
};

const statusAllPackages = (packages) => {
  for (const packageName of Object.keys(packages)) {
    if (!fs.existsSync(path.resolve('./packages', packageName))) {
      continue;
    }
    log('Running git status in directory: ', path.resolve('./packages', packageName));
    execSync(`git status`, {
      cwd: path.resolve('./packages', packageName),
      stdio: 'inherit',
    });
    log('\n---------------------------\n');
  }
};

const pullAllApps = (apps) => {
  for (const appName of Object.keys(apps)) {
    if (!fs.existsSync(path.resolve(appName))) {
      continue;
    }
    try {
      log('Running git pull in directory: ', path.resolve(appName));
      try {
        execSync(`git checkout -- ./package-lock.json`, {
          cwd: path.resolve(appName),
          stdio: 'inherit',
        });
      } catch (err) {
        console.warn(err);
      }
      execSync(`git pull`, {
        cwd: path.resolve(appName),
        stdio: 'inherit',
      });
    } catch (err) {
      // console.error(err);
    }
    log('\n---------------------------\n');
  }
};

const pullAllPackages = (packages) => {
  for (const packageName of Object.keys(packages)) {
    if (!fs.existsSync(path.resolve('./packages', packageName))) {
      continue;
    }
    try {
      log('Running git pull in directory: ', path.resolve('./packages', packageName));
      try {
        execSync(`git checkout -- ./package-lock.json`, {
          cwd: path.resolve('./packages', packageName),
          stdio: 'inherit',
        });
      } catch (err) {
        console.warn(err);
      }
      execSync(`git pull`, {
        cwd: path.resolve('./packages', packageName),
        stdio: 'inherit',
      });
    } catch (err) {
      // console.error(err);
    }
    log('\n---------------------------\n');
  }
};

module.exports = { pushAllApps, pushAllPackages, statusAllApps, statusAllPackages, pullAllApps, pullAllPackages };
