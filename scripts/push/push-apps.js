#!/bin/env node

const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');
const { pushAllApps } = require('../routines/git-packages');

const log = console.log;

const main = async () => {
  const envJson = JSON.parse(fs.readFileSync(path.resolve('./ecosystem.json')).toString());
  const set = envJson.sets.ecosystem;
  const allApps = envJson.apps;

  const apps = {};
  for (const app of set) {
    apps[app] = allApps[app];
  }
  pushAllApps(apps);

  try {
    log('Running git push in directory: ', path.resolve('./'));
    execSync(`git add --all && git commit -m 'refactor: update' && git push`, {
      stdio: 'inherit',
      cwd: path.resolve('./'),
    });
  } catch (err) {
    // console.error(err);
  }
  log('\n---------------------------\n');
};

main();
