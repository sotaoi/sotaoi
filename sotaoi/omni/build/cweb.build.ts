process.env.NODE_ENV = 'production';

import fs from 'fs';
import webpack, { Stats } from 'webpack';
import { WebpackConfigFactory } from '@sotaoi/omni/build/client.webpack.config';
import { paths } from '@sotaoi/omni/build/paths';
import path from 'path';
import { Helper } from '@sotaoi/api/helper';

const main = async (): Promise<void> => {
  // generate configuration
  const config = WebpackConfigFactory('production');

  // delete build folder
  fs.rmdirSync(paths.clientBuild, { recursive: true });

  // build
  const compiler = webpack(config as any);
  compiler.run((ex: Error, stats: Stats) => {
    if (ex) {
      console.info(ex);
      return;
    }

    Helper.copyFileSync(path.resolve('./var/client-start.js'), path.resolve(paths.clientBuild, 'start.js'));

    Helper.readdirSyncRecur(paths.clientPublic).map((item) => {
      const nextPath = path.resolve(paths.clientBuild, item.fullpath.substr(paths.clientPublic.length + 1));
      if (fs.existsSync(nextPath)) {
        return;
      }
      Helper.copyFileSync(item.fullpath, nextPath);
    });

    const { hash, startTime, endTime } = stats;
    if (!endTime || !startTime) {
      console.info(`hash: ${hash}\n`);
      return;
    }
    console.info(`hash: ${hash}\nbuild time: ${(endTime - startTime) / 1000}s\n`);
  });
};

main();
