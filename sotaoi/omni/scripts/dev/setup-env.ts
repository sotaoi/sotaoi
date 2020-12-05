import { execSync } from 'child_process';
import Os from 'os';
import fs from 'fs';
import path from 'path';
import yargs from 'yargs';

const main = (func: () => any): any => {
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
  const info = JSON.parse(fs.readFileSync(path.resolve(argv.info)).toString());

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
      execSync('sudo cp ./sotaoi/api/certs/fullchain.pem /usr/local/share/ca-certificates/fullchain.crt', {
        stdio: 'inherit',
      });

      const redHatUpdateCaTrust = '/bin/update-ca-trust';
      switch (true) {
        case fs.existsSync(redHatUpdateCaTrust):
          execSync(redHatUpdateCaTrust, { stdio: 'inherit' });
          break;
        default:
          execSync('sudo update-ca-certificates', { stdio: 'inherit' });
      }
    });
    break;
  default:
    console.debug('The script is available only for Mac or Linux environments.');
}
