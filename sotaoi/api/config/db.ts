export = {
  connection: {
    host: process.env.DB_HOST,
    database: process.env.DB_NAME,
    port: process.env.DB_PORT,
  },
  seedPath: process.env.DB_SEED_PATH,
};
