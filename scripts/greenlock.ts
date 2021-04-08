#!/usr/bin/env node

import path from 'path';
import _package from '@sotaoi/omni/app-package.json';
import { getAppInfo } from '@app/omni/get-app-info';
import fs from 'fs';
const Greenlock = require('greenlock');

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

const newKeyPath = path.resolve(process.env.SSL_CERT || '');
const newCertPath = path.resolve(process.env.SSL_KEY || '');
const newbundlePath = path.resolve(process.env.SSL_CA || '');
const newChainPath = path.resolve(process.env.SSL_CHAIN || '');
const newFullchainPath = path.resolve(process.env.SSL_FCHAIN || '');

const copyCerts = (): void => {
  fs.copyFileSync(keyPath, newKeyPath);
  fs.copyFileSync(certPath, newCertPath);
  fs.copyFileSync(bundlePath, newbundlePath);
  fs.copyFileSync(chainPath, newChainPath);
  fs.copyFileSync(fullchainPath, newFullchainPath);
};

const main = async (): Promise<void> => {
  const greenlock = Greenlock.create({
    configDir: path.resolve('./var/greenlock.d'),
    packageAgent: _package.name + '/' + _package.version,
    packageRoot: path.resolve('./'),
    maintainerEmail: appInfo.sslMaintainer,
    staging: false,
    notify: (event: any, details: any) => {
      if ('error' === event) {
        // `details` is an error object in this case
        console.error(details);
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
    })
    .catch((err: any) => {
      console.error(err);
    });
};

main();

process.on('exit', function () {
  if (
    !fs.existsSync(keyPath) ||
    !fs.existsSync(certPath) ||
    !fs.existsSync(bundlePath) ||
    !fs.existsSync(chainPath) ||
    !fs.existsSync(fullchainPath)
  ) {
    console.error('certificate files (all or some) appear to be missing');
    return;
  }
  copyCerts();
  console.info('greenlock ok. all done');
});

export {};
