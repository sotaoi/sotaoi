#!/bin/env node

const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');
const { pullAllApps, pullAllPackages } = require('./routines/git-packages');

const log = console.log;

const main = async () => {
  const envJson = JSON.parse(fs.readFileSync(path.resolve('./ecosystem.json')).toString());
  const set = envJson.sets.ecosystem;
  const allApps = envJson.apps;
  const packages = envJson.packages;

  const apps = {};
  for (const app of set) {
    apps[app] = allApps[app];
  }
  pullAllApps(apps);

  pullAllPackages(packages);

  try {
    log('Running git pull in directory: ', path.resolve('./'));
    execSync(`git pull`, {
      stdio: 'inherit',
      cwd: path.resolve('./'),
    });
  } catch (err) {
    // console.error(err);
  }
  log('\n---------------------------\n');
};

main();
