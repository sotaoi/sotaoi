process.env.NODE_ENV = 'production';

import fs from 'fs';
import path from 'path';
import { paths } from '@sotaoi/omni/build/paths';
import { Helper } from '@sotaoi/api/helper';
import { execSync } from 'child_process';
import yargs from 'yargs';

const main = async (): Promise<void> => {
  const argv = yargs
    .option('target', {
      alias: 't',
      description: 'Deployment target',
      type: 'string',
    })
    .help()
    .alias('help', 'h').argv;

  // build web client
  execSync('npm run build:cweb', { stdio: 'inherit' });

  // delete build folders
  fs.rmdirSync(paths.apiBuild, { recursive: true });
  fs.mkdirSync(paths.apiBuild, { recursive: true });
  fs.writeFileSync(`${paths.apiBuild}/.gitkeep`, '');

  // copy folders
  Helper.copyRecursiveSync(paths.appPath, `${paths.apiBuild}/app`);
  Helper.copyRecursiveSync(paths.sotaoiPath, `${paths.apiBuild}/sotaoi`);

  // copy files
  const items = Helper.readdirSync(path.resolve('./'));
  items.map((item) => {
    switch (true) {
      case item.extension === '' && ['.env'].indexOf(item.filename) === -1:
      case !item.isFile:
      case ['.log', '.example', '.sh'].indexOf(item.extension) !== -1:
      case item.filename.substr(0, 9) === 'tsconfig.':
        return;
      default:
        Helper.copyFileSync(item.fullpath, path.resolve(paths.apiBuild, item.filename));
    }
  });

  // copy other files
  fs.renameSync(path.resolve(paths.apiBuild, 'deploy.gitignore'), path.resolve(paths.apiBuild, '.gitignore'));
  Helper.copyFileSync(path.resolve('./tsconfig.build.json'), path.resolve(paths.apiBuild, 'tsconfig.json'));
  Helper.copyFileSync(path.resolve('./var/pmhook.js'), path.resolve(paths.apiBuild, 'var', 'pmhook.js'));
  const _package = JSON.parse(fs.readFileSync(path.resolve(paths.apiBuild, 'package.json')).toString());
  if (argv.target) {
    _package.scripts = { start: _package.scripts[`start:${argv.target}`], ..._package.scripts };
  }
  _package.scripts.postinstall = 'node ./var/pmhook.js --skipSdk';
  fs.writeFileSync(path.resolve(paths.apiBuild, 'package.json'), JSON.stringify(_package, null, 2));

  if (argv.target) {
    const info = JSON.parse(fs.readFileSync(path.resolve(paths.apiBuild, 'app', 'omni', 'info.json')).toString());
    info.deploymentTarget = argv.target;
    fs.writeFileSync(path.resolve(paths.apiBuild, 'app', 'omni', 'info.json'), JSON.stringify(info, null, 2));
  }

  // remove dev certificates
  const devPrivkey = path.resolve(paths.apiBuild, 'sotaoi', 'api', 'certs', 'privkey.pem');
  const devFullchain = path.resolve(paths.apiBuild, 'sotaoi', 'api', 'certs', 'fullchain.pem');
  fs.existsSync(devPrivkey) && fs.unlinkSync(devPrivkey);
  fs.existsSync(devFullchain) && fs.unlinkSync(devFullchain);

  // install and ts compile
  execSync('npx tsc', { cwd: path.resolve(paths.apiBuild), stdio: 'inherit' });

  // remove ts related
  fs.unlinkSync(path.resolve(paths.apiBuild, 'tsconfig.json'));
  Helper.readdirSyncRecur(paths.apiBuild, ['node_modules', '.git']).map((item) => {
    if (['.ts', '.tsx'].indexOf(item.extension) === -1 || item.isDir) {
      return;
    }
    if (item.filename.substr(-5) === '.d.ts') {
      fs.unlinkSync(item.fullpath);
      return;
    }
    const nextFilename = path.resolve(item.dir, item.filename.split('.').slice(0, -1).join('.').concat('.js'));
    if (!fs.existsSync(nextFilename)) {
      return;
    }
    fs.unlinkSync(item.fullpath);
  });
};

main();
