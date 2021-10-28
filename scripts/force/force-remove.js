#!/bin/env node

const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

const main = async () => {
  for (const item of fs.readdirSync(path.resolve('./'))) {
    if (
      [
        '.ds_store',
        '.git',
        '.vscode',
        'node_modules',
        'old',
        'pocket',
        'scripts',
        'shell',
        '.env',
        '.env.example',
        '.gitignore',
        '.ignore',
        '.prettierrc',
        'ecosystem.json',
        'notes.txt',
        'package-lock.json',
        'package.json',
        'readme.txt',
        'todo.txt',
      ].indexOf(item.toLowerCase()) === -1
    ) {
      if (item.substr(0, 3) === 'bak') {
        continue;
      }
      if (!fs.lstatSync(path.resolve(item)).isDirectory()) {
        fs.unlinkSync(path.resolve(item));
        continue;
      }
      fs.rmdirSync(path.resolve(item), { recursive: true });
    }
  }
  execSync('git checkout -- ./packages', { stdio: 'inherit' });
};

main();
