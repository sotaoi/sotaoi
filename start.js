#!/usr/bin/env node

const { exec } = require('child_process');
const Tail = require('tail').Tail;
const fs = require('fs');

const main = async () => {
  !fs.existsSync('./output.log') && fs.writeFileSync('./output.log', '');
  const outputTail = new Tail('./output.log');
  outputTail.on('line', (data) => console.log(data));
  // outputTail.on('error', (error) => console.log('ERROR: ', error));

  if (process.env.NODE_ENV !== 'production') {
    exec('npm run start:api >> ./output.log 2>&1');
    exec('npm run start:cweb >> ./output.log 2>&1');
    exec('npm run start:proxy >> ./output.log 2>&1');
    return;
  }

  exec('npm run start:api:prod >> ./output.log 2>&1');
  exec('npm run start:cweb:prod >> ./output.log 2>&1');
  exec('npm run start:proxy:prod >> ./output.log 2>&1');
};

main();
