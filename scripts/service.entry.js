#!/bin/env node

const fs = require('fs');
const path = require('path');

const main = async () => {
  if (!fs.existsSync(path.resolve('./scripts/service.main.js'))) {
    return;
  }
  require(path.resolve('./scripts/service.main.js'));
};

main();
