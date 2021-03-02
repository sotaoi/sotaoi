#!/bin/env node

const execSync = require('child_process').execSync;
const path = require('path');

const main = async () => {
  let androidSdkDirectory;
  let javaDirectory;
  let parameters;

  switch (true) {
    // mac
    case process.platform === 'darwin':
      androidSdkDirectory = path.resolve('./var/build/sdk/mac-android-sdk');
      javaDirectory = path.resolve('./var/build/sdk/mac-java');

      parameters = [
        `ANDROID_HOME="${androidSdkDirectory}"`,
        `JAVA_HOME="${path.resolve(javaDirectory, './JavaVirtualMachines/jdk1.8.0_212.jdk/Contents/Home')}"`,
      ];

      // ios
      // todo

      // android
      execSync(`${parameters.join(' ')} ./gradlew clean`, { stdio: 'inherit', cwd: path.resolve('./android') });

      break;
    // linux
    case process.platform === 'linux':
      androidSdkDirectory = path.resolve('./var/build/sdk/linux-android-sdk');
      javaDirectory = path.resolve('./var/build/sdk/linux-java');

      // nothing here yet #infra

      break;
    // windows (not supported)
    case process.platform === 'win32':
      console.error('windows is not supported');
      return;
    // unknown operating system
    default:
      console.error('unknown operating system');
      return;
  }
};

main();

// ios
// todo

// android
//
