import fs from 'fs';
import path from 'path';

export function loadHelp(filename) {
  let helpFilePath = path.join(__dirname, 'help', `${filename}.txt`);
  return fs.readFileSync(helpFilePath, 'utf8');
}

export function loadVersion() {
  return require(path.join(__dirname, '../..', 'package.json')).version;
}
