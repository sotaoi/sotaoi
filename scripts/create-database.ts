import mysql from 'mysql';
import { config } from '@sotaoi/api/config';

const clogger = console.log;

const dbConfig = config('db.connection');

const conn = mysql.createConnection({
  host: dbConfig.host,
  user: dbConfig.user,
  password: dbConfig.password,
});

clogger('connecting to mysql.');

conn.connect((ex, result) => {
  if (ex) {
    throw ex;
  }

  clogger('connected.');

  conn.query(
    `CREATE DATABASE \`${dbConfig.database}\` CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci`,
    (ex, result) => {
      if (ex) {
        throw ex;
      }

      clogger(`query ok, database '${dbConfig.database}' created.`);

      conn.end();
    },
  );
});
