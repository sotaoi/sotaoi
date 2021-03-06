import fs from 'fs';
import path from 'path';
import { paths } from '@sotaoi/omni/build/paths';
import { Helper } from '@sotaoi/api/helper';
import { execSync } from 'child_process';

const main = async (): Promise<void> => {
  // npm install
  execSync('npm install', { stdio: 'inherit' });

  // build web client
  execSync(`cross-env NODE_ENV=${process.env.NODE_ENV} ts-node ./sotaoi/omni/build/cweb.build.ts`, {
    stdio: 'inherit',
  });

  // delete build folders
  fs.rmdirSync(paths.appBuild, { recursive: true });
  fs.mkdirSync(paths.appBuild, { recursive: true });
  fs.writeFileSync(`${paths.appBuild}/.gitkeep`, '');

  // copy folders
  Helper.copyRecursiveSync(paths.appPath, `${paths.appBuild}/app`);
  Helper.copyRecursiveSync(paths.phpPath, `${paths.appBuild}/php`);
  Helper.copyRecursiveSync(paths.scriptsPath, `${paths.appBuild}/scripts`);
  Helper.copyRecursiveSync(paths.sotaoiPath, `${paths.appBuild}/sotaoi`);
  Helper.copyRecursiveSync(paths.storagePath, `${paths.appBuild}/storage`);
  // remove all shell files from scripts
  fs.readdirSync(`${paths.appBuild}/scripts`).map((filename) => {
    const file = path.resolve(`${paths.appBuild}/scripts/${filename}`);
    const extname = path.extname(filename);
    ['.sh'].indexOf(extname) !== -1 && fs.rmSync(file);
  });
  //
  fs.mkdirSync(`${paths.appBuild}/logs`);
  Helper.copyRecursiveSync(paths.publicPath, `${paths.appBuild}/public`);

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
  Helper.copyFileSync(path.resolve('./tsconfig.build.json'), path.resolve(paths.appBuild, 'tsconfig.json'));
  Helper.copyFileSync(path.resolve('./var/pmhook.js'), path.resolve(paths.appBuild, 'var', 'pmhook.js'));
  Helper.copyFileSync(path.resolve('./start.js'), path.resolve(paths.appBuild, 'start.js'));
  // process package json
  const _package = JSON.parse(fs.readFileSync(path.resolve(paths.appBuild, 'package.json')).toString());
  _package.scripts.postinstall = 'node ./var/pmhook.js --skipSdk';
  _package.flags.isBuild = true;
  fs.writeFileSync(path.resolve(paths.appBuild, 'package.json'), JSON.stringify(_package, null, 2));

  // install and ts compile
  execSync('npx tsc', { cwd: paths.appBuild, stdio: 'inherit' });

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

  // final cweb build move
  const cwebBuildPath = path.resolve(paths.appBuild, 'public', 'build');
  Helper.readdirSync(cwebBuildPath).map((item) => {
    const itemNewPath = path.resolve(paths.appBuild, 'public', item.filename);
    fs.renameSync(item.fullpath, itemNewPath);
  });
  fs.rmdirSync(cwebBuildPath);

  // clean source web build
  fs.rmdirSync(paths.clientBuild, { recursive: true });

  // php
  execSync('node ./var/refresh.js', { cwd: path.resolve(paths.appBuild, 'php'), stdio: 'inherit' });

  // npm install
  execSync('npm install', { cwd: paths.appBuild, stdio: 'inherit' });
};

main();
