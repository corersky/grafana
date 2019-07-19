import { PluginMeta } from '@grafana/ui';

import path = require('path');
import fs = require('fs');

import { constants } from '../../e2e/constants';

export interface Settings {
  plugin: PluginMeta;
  outputFolder: string;
}

export function getSettings() {
  let f = path.resolve(process.cwd(), 'ci', 'dist', 'plugin.json');
  if (!fs.existsSync(f)) {
    f = path.resolve(process.cwd(), 'dist', 'plugin.json');
    if (!fs.existsSync(f)) {
      f = path.resolve(process.cwd(), 'src', 'plugin.json');
    }
  }
  const outputFolder = path.resolve(process.cwd(), 'e2e-results');
  if (!fs.existsSync(outputFolder)) {
    fs.mkdirSync(outputFolder, { recursive: true });
  }
  constants.screenShotsTruthDir = path.resolve(process.cwd(), 'e2e', 'truth');
  constants.screenShotsOutputDir = outputFolder;

  return {
    plugin: require(f) as PluginMeta,
    outputFolder,
  };
}
