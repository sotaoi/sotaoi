import express from 'express';
import http from 'http';
import https from 'https';
import { createProxyMiddleware } from 'http-proxy-middleware';
import fs from 'fs';
import { AppInfo } from '@sotaoi/omni/state';

const proxy = (info: AppInfo): void => {
  const noSecure = process.env.NODE_ENV === 'production';
  const app = express();

  app.use(
    '/api',
    createProxyMiddleware({
      secure: false,
      // pathRewrite: {
      //   '^/api/': '/api/',
      // },
      target: noSecure ? `http://localhost:${info.devApiPort}` : `https://${info.devApiDomain}:${info.devApiPort}`,
      ws: false,
      changeOrigin: true,
    }),
  );

  app.use(
    '/',
    createProxyMiddleware({
      secure: false,
      target: noSecure
        ? `http://localhost:${info.devClientPort}`
        : `https://${info.devClientDomain}:${info.devClientPort}`,
      ws: true,
      changeOrigin: true,
    }),
  );

  // const certs =
  //   process.env.NODE_ENV === 'development'
  //     ? {
  //         key: fs.readFileSync('./sotaoi/api/certs/privkey.pem'),
  //         cert: fs.readFileSync('./sotaoi/api/certs/fullchain.pem'),
  //       }
  //     : {
  //         key: fs.readFileSync('./sotaoi/api/certs/private.key'),
  //         cert: fs.readFileSync('./sotaoi/api/certs/certificate.crt'),
  //         ca: fs.readFileSync('./sotaoi/api/certs/ca_bundle.crt'),
  //       };

  const certs = noSecure
    ? {}
    : {
        key: fs.readFileSync('./sotaoi/api/certs/privkey.pem'),
        cert: fs.readFileSync('./sotaoi/api/certs/fullchain.pem'),
      };

  noSecure
    ? http.createServer(app).listen(process.env.PORT || '80')
    : https
        .createServer(
          {
            ...certs,
            rejectUnauthorized: false,
          },
          app,
        )
        .listen(process.env.PORT || '443');

  // # REDIRECT HTTP to HTTPS
  if (!noSecure && process.env.PORT === '443') {
    const redirect = express();
    redirect.get('*', (req, res) =>
      res.redirect(`https://${process.env.NODE_ENV !== 'development' ? info.prodDomain : info.devDomain}${req.url}`),
    );
    redirect.listen(80);
  }
};

export { proxy };
