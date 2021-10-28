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
        '.gitignore',
        '.ignore',
        '.prettierrc',
        '.vscode',
        '.env',
        '.env.example',
        'ecosystem.json',
        'certs',
        'node_modules',
        'notes.txt',
        'old',
        'package.json',
        'package-lock.json',
        'pocket',
        'readme.txt',
        'scripts',
        'shell',
        'todo.txt',
      ].indexOf(item.toLowerCase()) === -1
    ) {
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
