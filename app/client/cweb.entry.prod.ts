require('dotenv').config();

import express from 'express';
import path from 'path';
import https from 'https';
import fs from 'fs';

const app = express();
const publicPath = path.resolve(__dirname, 'build');

app.use(express.static(publicPath));
app.get('*', function (req: any, res: any) {
  res.sendFile(publicPath + '/index.html');
});

https
  .createServer(
    {
      key: fs.readFileSync('./sotaoi/api/certs/privkey.pem'),
      cert: fs.readFileSync('./sotaoi/api/certs/fullchain.pem'),
      // ca: null,
      rejectUnauthorized: false,
    },
    app,
  )
  .listen(process.env.PORT || '8080');
