#!/bin/env node

const fs = require('fs');
const path = require('path');

const main = async () => {
  //

  !fs.existsSync(path.resolve('./.env')) && fs.copyFileSync(path.resolve('./.env.example'), path.resolve('./.env'));

  !fs.existsSync(path.resolve('./pocket/env.json')) &&
    fs.copyFileSync(path.resolve('./pocket/env.example.json'), path.resolve('./pocket/env.json'));

  !fs.existsSync(path.resolve('./scripts/service.main.js')) &&
    fs.copyFileSync(path.resolve('./scripts/service.main.example.js'), path.resolve('./scripts/service.main.js'));

  //
};

main();
