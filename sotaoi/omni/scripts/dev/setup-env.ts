import { execSync } from 'child_process';
import Os from 'os';
import fs from 'fs';
import path from 'path';
import yargs from 'yargs';
import { AppInfo } from '@sotaoi/omni/state';

const argv = yargs
  .option('info', {
    alias: 'i',
    description: 'File path for app info.json',
    type: 'string',
  })
  .help()
  .alias('help', 'h').argv;
if (!argv.info) {
  throw new Error('File path for app info.json is missing. --info is required');
}
const info: AppInfo = JSON.parse(fs.readFileSync(path.resolve(argv.info)).toString());

const main = (func: () => any): any => {
  // create snakeoil certs
  execSync(`./var/create-certs.sh ${info.devDomain}`, { stdio: 'inherit' });
  console.debug('\nadding certificates to trust store...');
  let hostsFile = fs.readFileSync('/etc/hosts').toString();
  if (hostsFile.search(info.devDomain) === -1 || hostsFile.search(info.devDomainAlias) === -1) {
    console.debug('adding domain and domain alias to /etc/hosts file...');
    execSync('echo "" | sudo tee -a /etc/hosts', { stdio: 'inherit' });
    hostsFile.search(info.devDomain) === -1 &&
      execSync(`echo "127.0.0.1 ${info.devDomain}" | sudo tee -a /etc/hosts`, { stdio: 'inherit' });
    hostsFile.search(info.devDomainAlias) === -1 &&
      execSync(`echo "127.0.0.1 ${info.devDomainAlias}" | sudo tee -a /etc/hosts`, { stdio: 'inherit' });
  }
  func();
  console.debug('\ncompleted.\n');
};

// trust certs localy
switch (Os.platform()) {
  case 'darwin':
    main(() => {
      execSync(
        `sudo -S security add-trusted-cert -d -r trustRoot -k /Library/Keychains/System.keychain \
          ./sotaoi/api/certs/fullchain.pem`,
        { stdio: 'inherit' },
      );
    });
    break;
  case 'linux':
    main(() => {
      switch (true) {
        // centos / redhat
        case fs.existsSync('/bin/update-ca-trust'):
          if (fs.existsSync(`sudo /usr/local/share/ca-certificates/${info.packageName}`)) {
            execSync('/bin/update-ca-trust', { stdio: 'inherit' });
            console.warn('warning: trust store has certificates folder, skipping certificate generation');
            return;
          }
          execSync(`sudo mkdir -p /usr/local/share/ca-certificates/${info.packageName}`, { stdio: 'inherit' });
          execSync(
            `sudo cp ./sotaoi/api/certs/fullchain.pem /usr/local/share/ca-certificates/${info.packageName}/fullchain.crt`,
            {
              stdio: 'inherit',
            },
          );
          execSync('/bin/update-ca-trust', { stdio: 'inherit' });
          break;
        // debian
        default:
          if (fs.existsSync(`sudo /usr/local/share/ca-certificates/${info.packageName}`)) {
            console.warn('warning: trust store has certificates folder, skipping certificate generation');
            return;
          }
          execSync(`sudo mkdir -p /usr/local/share/ca-certificates/${info.packageName}`, { stdio: 'inherit' });
          execSync(
            `sudo cp ./sotaoi/api/certs/fullchain.pem /usr/local/share/ca-certificates/${info.packageName}/fullchain.crt`,
            {
              stdio: 'inherit',
            },
          );
          // execSync('sudo dpkg-reconfigure -p critical ca-certificates');
          execSync('sudo dpkg-reconfigure ca-certificates');
          execSync('sudo update-ca-certificates', { stdio: 'inherit' });
      }
    });
    break;
  default:
    console.debug('The script is available only for Mac or Linux environments.');
}
