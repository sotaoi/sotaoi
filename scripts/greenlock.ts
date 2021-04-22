#!/usr/bin/env node

import path from 'path';
import _package from '@sotaoi/omni/app-package.json';
import { getAppInfo } from '@app/omni/get-app-info';
import fs from 'fs';
import { exec } from 'child_process';
import { logger } from '@sotaoi/api/logger';
const Greenlock = require('greenlock');
const Tail = require('tail').Tail;

let proxyProcess: any = null;

const appInfo = getAppInfo();

const altnames =
  process.env.NODE_ENV === 'production'
    ? [
        appInfo.prodDomain,
        ...[appInfo.prodDomainAlias].filter((domain: string) => domain !== appInfo.prodDomain && domain),
      ]
    : process.env.NODE_ENV === 'staging'
    ? [
        appInfo.stageDomain,
        ...[appInfo.stageDomainAlias].filter((domain: string) => domain !== appInfo.stageDomain && domain),
      ]
    : [
        appInfo.devDomain,
        ...[appInfo.devDomainAlias].filter((domain: string) => domain !== appInfo.devDomain && !!domain),
      ];

const keyPath = path.resolve(`./var/greenlock.d/live/${altnames[0]}/privkey.pem`);
const certPath = path.resolve(`./var/greenlock.d/live/${altnames[0]}/cert.pem`);
const bundlePath = path.resolve(`./var/greenlock.d/live/${altnames[0]}/bundle.pem`);
const chainPath = path.resolve(`./var/greenlock.d/live/${altnames[0]}/chain.pem`);
const fullchainPath = path.resolve(`./var/greenlock.d/live/${altnames[0]}/fullchain.pem`);

const newKeyPath = path.resolve(process.env.SSL_KEY || '');
const newCertPath = path.resolve(process.env.SSL_CERT || '');
const newbundlePath = path.resolve(process.env.SSL_CA || '');
const newChainPath = path.resolve(process.env.SSL_CHAIN || '');
const newFullchainPath = path.resolve(process.env.SSL_FCHAIN || '');

const checkCertificatesInterval = (): void => {
  let intervalCount = 0;
  setInterval(() => {
    if (
      fs.existsSync(keyPath) &&
      fs.existsSync(certPath) &&
      fs.existsSync(bundlePath) &&
      fs.existsSync(chainPath) &&
      fs.existsSync(fullchainPath)
    ) {
      if (intervalCount > 19) {
        logger().error('certificate files (all or some) appear to be missing');
        proxyProcess && proxyProcess.kill();
        process.exit(1);
      }
      intervalCount++;

      fs.copyFileSync(keyPath, newKeyPath);
      fs.copyFileSync(certPath, newCertPath);
      fs.copyFileSync(bundlePath, newbundlePath);
      fs.copyFileSync(chainPath, newChainPath);
      fs.copyFileSync(fullchainPath, newFullchainPath);

      console.info('greenlock ok. all done');
      proxyProcess && proxyProcess.kill();
      process.exit(0);
    }
  }, 1000);
};

const main = async (): Promise<void> => {
  // clean and backup ./sotaoi/api/certs/*.pem
  !fs.existsSync(path.resolve('./sotaoi/api/certs/backup')) && fs.mkdirSync(path.resolve('./sotaoi/api/certs/backup'));
  fs.existsSync(path.resolve('./sotaoi/api/certs/bundle.pem')) &&
    fs.renameSync(path.resolve('./sotaoi/api/certs/bundle.pem'), path.resolve('./sotaoi/api/certs/backup/bundle.pem'));
  fs.existsSync(path.resolve('./sotaoi/api/certs/cert.pem')) &&
    fs.renameSync(path.resolve('./sotaoi/api/certs/cert.pem'), path.resolve('./sotaoi/api/certs/backup/cert.pem'));
  fs.existsSync(path.resolve('./sotaoi/api/certs/chain.pem')) &&
    fs.renameSync(path.resolve('./sotaoi/api/certs/chain.pem'), path.resolve('./sotaoi/api/certs/backup/chain.pem'));
  fs.existsSync(path.resolve('./sotaoi/api/certs/fullchain.pem')) &&
    fs.renameSync(
      path.resolve('./sotaoi/api/certs/fullchain.pem'),
      path.resolve('./sotaoi/api/certs/backup/fullchain.pem'),
    );
  fs.existsSync(path.resolve('./sotaoi/api/certs/privkey.pem')) &&
    fs.renameSync(
      path.resolve('./sotaoi/api/certs/privkey.pem'),
      path.resolve('./sotaoi/api/certs/backup/privkey.pem'),
    );

  // clean ./var/greenlock.d
  fs.rmdirSync(path.resolve('./var/greenlock.d'), { recursive: true });
  fs.mkdirSync(path.resolve('./var/greenlock.d'));
  fs.writeFileSync(path.resolve('./var/greenlock.d/.gitkeep'), '');
  fs.writeFileSync(path.resolve('./var/greenlock.d/output.log'), '');

  const greenlockTail = new Tail('./var/greenlock.d/output.log');
  greenlockTail.on('line', (data: string) => console.info(data));
  proxyProcess = exec(
    'npx cross-env NODE_ENV=development PORT=443 GREENLOCK=yes ts-node ./app/api/proxy.entry.ts >> ./var/greenlock.d/output.log 2>&1',
  );

  await setTimeout((): void => {
    //
  }, 1500);

  const greenlock = Greenlock.create({
    configDir: path.resolve('./var/greenlock.d'),
    packageAgent: _package.name + '/' + _package.version,
    packageRoot: path.resolve('./'),
    maintainerEmail: appInfo.sslMaintainer,
    staging: false,
    notify: (event: any, details: any) => {
      if ('error' === event) {
        // `details` is an error object in this case
        logger().error(details);
      }
    },
  });

  greenlock
    .add({
      agreeToTerms: true,
      subscriberEmail: appInfo.sslMaintainer,
      subject: altnames[0],
      altnames,
    })
    .then((fullConfig: any) => {
      console.info('greenlock ok. fetching certificates...');
      checkCertificatesInterval();
    })
    .catch((err: any) => {
      logger().error(err && err.stack ? err.stack : err);
      proxyProcess && proxyProcess.kill();
      process.exit(1);
    });
};

main();

export {};
