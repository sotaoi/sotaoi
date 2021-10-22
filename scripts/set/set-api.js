#!/bin/env node

const fs = require('fs');
const path = require('path');
const { installApps, installPackages } = require('../routines/install-items');

const main = async () => {
  const envJson = JSON.parse(fs.readFileSync(path.resolve('./ecosystem.json')).toString());
  const set = envJson.sets.api;
  const allApps = envJson.apps;
  const packages = envJson.packages;

  const apps = {};
  for (const app of set) {
    apps[app] = allApps[app];
  }
  installApps(apps);

  installPackages(packages);
};

main();
