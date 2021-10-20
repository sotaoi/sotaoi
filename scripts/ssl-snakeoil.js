#!/bin/env node

const fs = require('fs');
const path = require('path');
const commandExistsSync = require('command-exists').sync;
const { execSync } = require('child_process');

const main = async () => {
  //

  if (!commandExistsSync('openssl')) {
    console.error('No "openssl" binary detected, this command runs only with OpenSSL, exiting...');
    return;
  }

  let certsDirEmpty = true;

  const certsDir = path.resolve('./pocket/certs');

  if (!fs.existsSync(certsDir)) {
    console.error('Pocket certs dir does not exist');
    return;
  }
  for (const item of fs.readdirSync(certsDir)) {
    if (item.charAt(0) === '.') {
      continue;
    }
    if (fs.lstatSync(path.resolve(certsDir, item)).isFile()) {
      certsDirEmpty = false;
      break;
    }
  }
  if (!certsDirEmpty) {
    console.error('Pocket certs dir is not empty, exiting...');
    return;
  }

  execSync(
    "openssl req -new -x509 -nodes -out ./cert.pem -keyout ./privkey.pem -days 365 -subj '/CN=alarmion.ddns.net'",
    { cwd: path.resolve('./pocket/certs'), stdio: 'inherit' },
  );
  fs.writeFileSync(path.resolve('./pocket/certs/bundle.pem'), '');
  fs.writeFileSync(path.resolve('./pocket/certs/chain.pem'), '');
  fs.writeFileSync(path.resolve('./pocket/certs/fullchain.pem'), '');
};

main();
