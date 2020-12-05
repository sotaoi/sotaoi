const fs = require('fs');
const path = require('path');
const yargs = require('yargs');

const main = async () => {
  const argv = yargs
    .option('skipSdk', {
      alias: 's',
      description: 'Skip sdk unpacking (for production mode)',
      type: 'boolean',
    })
    .help()
    .alias('help', 'h').argv;

  // @app {

  const appSymlinkPath = path.resolve(__dirname, '../node_modules/@app');
  const frameworkSymlinkPath = path.resolve(__dirname, '../node_modules/@sotaoi');

  const createAppSymlinks = () => {
    fs.rmdirSync(appSymlinkPath, { recursive: true });
    fs.mkdirSync(appSymlinkPath);
    fs.symlinkSync('../../app/api', path.resolve(`${appSymlinkPath}/api`));
    fs.symlinkSync('../../app/client', path.resolve(`${appSymlinkPath}/client`));
    fs.symlinkSync('../../app/omni', path.resolve(`${appSymlinkPath}/omni`));
  };

  const createFrameworkSymlinks = () => {
    fs.rmdirSync(frameworkSymlinkPath, { recursive: true });
    fs.mkdirSync(frameworkSymlinkPath);
    fs.symlinkSync('../../sotaoi/api', path.resolve(`${frameworkSymlinkPath}/api`));
    fs.symlinkSync('../../sotaoi/client', path.resolve(`${frameworkSymlinkPath}/client`));
    fs.symlinkSync('../../sotaoi/omni', path.resolve(`${frameworkSymlinkPath}/omni`));
  };

  // ensure symlinks {

  if (!fs.existsSync(appSymlinkPath)) {
    createAppSymlinks();
  }
  if (!fs.existsSync(frameworkSymlinkPath)) {
    createFrameworkSymlinks();
  }

  // }

  // sdk {

  if (!argv.skipSdk && !fs.existsSync(path.resolve('./var/build/sdk'))) {
    const sevenBin = require('7zip-bin');
    const { extractFull } = require('node-7z');

    extractFull(path.resolve('./var/build/sdk.7z.001'), path.resolve('./client'), {
      $bin: sevenBin.path7za,
    });
  }

  // }
};

main();
