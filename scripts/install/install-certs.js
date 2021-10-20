#!/bin/env node

const fs = require('fs');
const path = require('path');

const main = async () => {
  if (!fs.existsSync(path.resolve('./app-omni'))) {
    console.warn(
      'Default development path of @app/omni "./app-omni" does not exist, skipping cert install execution...',
    );
    return;
  }

  !fs.existsSync(path.resolve('./app-omni/certs')) && fs.mkdirSync(path.resolve('./app-omni/certs'));

  for (const item of fs.readdirSync(path.resolve('./pocket/certs'))) {
    if (item[0] === '.' || fs.lstatSync(path.resolve('./pocket/certs', item)).isDirectory()) {
      continue;
    }
    const certpath = path.resolve('./pocket/certs', item);
    fs.copyFileSync(certpath, path.resolve(`./app-omni/certs/${item}`));
  }
};

main();
