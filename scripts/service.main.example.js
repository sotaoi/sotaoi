#!/bin/env node

const fs = require('fs');
const path = require('path');
const { getTimestamp } = require('./routines/generic');

const main = async () => {
  const basePath = path.resolve('./');
  fs.existsSync(path.resolve(basePath, 'service-test.log')) && fs.rmSync(path.resolve(basePath, 'service-test.log'));
  fs.writeFileSync(
    path.resolve(basePath, 'service-test.log'),
    `--- --- ---\n${getTimestamp()}: Service has been initialized\n--- --- ---\n`,
  );
};

main();
