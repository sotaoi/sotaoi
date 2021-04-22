import mongoose from 'mongoose';
import { config } from '@sotaoi/api/config';
import fs from 'fs';
import path from 'path';
import { Job } from '@sotaoi/api/job';

let connected = false;

const connect = async (): Promise<void> => {
  if (connected) {
    return;
  }
  connected = true;
  const dbConfig = config('db');
  await mongoose.connect(
    `mongodb://${dbConfig.connection.host}:${dbConfig.connection.port}/${dbConfig.connection.database}`,
    {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    },
  );
};

const seed = async (): Promise<void> => {
  const dbConfig = config('db');
  const runSeed = async (job: new () => Job): Promise<void> => {
    const jobInstance = new job();
    await jobInstance.handle();
  };

  for (const seedFile of fs.readdirSync(path.resolve(dbConfig.seedPath))) {
    const seed = require(path.resolve(dbConfig.seedPath, seedFile));
    if (seed.prototype instanceof Job) {
      await runSeed(seed);
      return;
    }
    for (const seedExport of Object.values(seed)) {
      if (!((seedExport as any).prototype instanceof Job)) {
        continue;
      }
      await runSeed(seedExport as new () => Job);
      return;
    }
  }
};

export { connect, seed };
export * from 'mongoose';
