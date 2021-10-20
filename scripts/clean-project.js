#!/bin/env node

const fs = require('fs');
const path = require('path');

const main = async (dirpath, noSubset) => {
  const items = fs.readdirSync(dirpath);
  items.map((item) => {
    const fullpath = path.resolve(dirpath, item);
    if (!fs.lstatSync(fullpath).isDirectory()) {
      return;
    }
    if (item === 'packages' && !noSubset) {
      main(fullpath, true);
      return;
    }
    if (fs.existsSync(path.resolve(fullpath, 'package.json'))) {
      clean(path.resolve(fullpath, 'package.json'));
    }
  });
};

const clean = (packageJsonPath) => {
  fs.rmdirSync(path.resolve(path.dirname(packageJsonPath), 'node_modules'), { recursive: true });
};

main(path.resolve('./'), false);
