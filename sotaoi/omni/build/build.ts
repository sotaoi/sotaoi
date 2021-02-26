process.env.NODE_ENV = 'production';

import fs from 'fs';
import path from 'path';
import { paths } from '@sotaoi/omni/build/paths';
import { Helper } from '@sotaoi/api/helper';
import { execSync } from 'child_process';
import yargs from 'yargs';

const main = async (): Promise<void> => {
  const argv = yargs.help().alias('help', 'h').argv;

  // build web client
  execSync('npm run build:cweb');

  // delete build folders
  fs.rmdirSync(paths.appBuild, { recursive: true });
  fs.mkdirSync(paths.appBuild, { recursive: true });
  fs.writeFileSync(`${paths.appBuild}/.gitkeep`, '');

  // copy folders
  Helper.copyRecursiveSync(paths.appPath, `${paths.appBuild}/app`);
  Helper.copyRecursiveSync(paths.sotaoiPath, `${paths.appBuild}/sotaoi`);
  Helper.copyRecursiveSync(paths.storagePath, `${paths.appBuild}/storage`);

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
        Helper.copyFileSync(item.fullpath, path.resolve(paths.appBuild, item.filename));
    }
  });

  // copy other files
  fs.renameSync(path.resolve(paths.appBuild, 'deploy.gitignore'), path.resolve(paths.appBuild, '.gitignore'));
  Helper.copyFileSync(path.resolve('./tsconfig.build.json'), path.resolve(paths.appBuild, 'tsconfig.json'));
  Helper.copyFileSync(path.resolve('./var/pmhook.js'), path.resolve(paths.appBuild, 'var', 'pmhook.js'));
  Helper.copyFileSync(path.resolve('./start.js'), path.resolve(paths.appBuild, 'start.js'));
  const _package = JSON.parse(fs.readFileSync(path.resolve(paths.appBuild, 'package.json')).toString());
  if (argv.target) {
    _package.scripts = { start: _package.scripts[`start:${argv.target}`], ..._package.scripts };
  }
  _package.scripts.postinstall = 'node ./var/pmhook.js --skipSdk';
  fs.writeFileSync(path.resolve(paths.appBuild, 'package.json'), JSON.stringify(_package, null, 2));

  if (argv.target) {
    // todo here: maybe this is a simple copy now
    const info = JSON.parse(fs.readFileSync(path.resolve(paths.appBuild, 'app', 'omni', 'app-info.json')).toString());
    fs.writeFileSync(path.resolve(paths.appBuild, 'app', 'omni', 'app-info.json'), JSON.stringify(info, null, 2));
  }

  // install and ts compile
  execSync('npx tsc', { cwd: path.resolve(paths.appBuild), stdio: 'inherit' });

  // remove ts related
  fs.unlinkSync(path.resolve(paths.appBuild, 'tsconfig.json'));
  Helper.readdirSyncRecur(paths.appBuild, ['node_modules', '.git']).map((item) => {
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
