export = {
  client: 'mysql',
  connection: {
    // host: process.env.DB_HOST || 'qwertydb.ddns.net',
    // user: process.env.DB_USER || 'monologz.art',
    // password: process.env.DB_PASSWORD || 'gorgonzaurus',
    // database: process.env.DB_NAME || 'monologzart',
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
  },
  pool: { min: 0, max: 7 },
};
