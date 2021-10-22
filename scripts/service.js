#!/bin/env node

const fs = require('fs');
const path = require('path');

const main = async () => {
  const basePath = path.resolve('./');
  fs.existsSync(path.resolve(basePath, 'service-test.log')) && fs.rmSync(path.resolve(basePath, 'service-test.log'));
  fs.writeFileSync(
    path.resolve(basePath, 'service-test.log'),
    '--- --- ---\nService has been initialized\n--- --- ---\n',
  );
};

main();
