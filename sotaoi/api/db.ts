import { QueryBuilder } from '@sotaoi/omni/transactions';
// import { app } from '@sotaoi/api/app-kernel';
// import knex from 'knex';

const db = (repository: string): QueryBuilder => {
  // return knex(app().config('db'))(repository);
};

const disconnect = async (): Promise<void> => {
  // await knex(app().config('db')).destroy();
};

export { db, disconnect };
