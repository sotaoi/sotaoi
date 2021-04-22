import mongoose from 'mongoose';
import { config } from '@sotaoi/api/config';
import fs from 'fs';
import path from 'path';
import { Job } from '@sotaoi/api/job';
// import { QueryBuilder } from '@sotaoi/omni/transactions';
// import knex from 'knex';

let connected = false;

const connect = async (): Promise<void> => {
  if (connected) {
    return;
  }
  connected = true;
  const dbConfig = config('db');
  await mongoose.connect(`mongodb://localhost:27017/${dbConfig.connection.database}`, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  });
};

// const db = (repository: string): QueryBuilder => {
const db = (repository: string): any => {
  // return knex(app().config('db'))(repository);
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

export { connect, db, seed };
export * from 'mongoose';
