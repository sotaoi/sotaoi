import express from 'express';
import http from 'http';
import https from 'https';
import { createProxyMiddleware } from 'http-proxy-middleware';
import fs from 'fs';
import { AppInfo } from '@sotaoi/omni/state';

const proxy = (info: AppInfo): void => {
  const production = process.env.NODE_ENV === 'production';
  const app = express();

  // temporarily use localhost domain, so that heroku deployment will work

  app.use(
    '/api',
    createProxyMiddleware({
      secure: false,
      // pathRewrite: {
      //   '^/api/': '/api/',
      // },
      target: production ? `https://localhost:${info.prodApiPort}` : `https://localhost:${info.devApiPort}`,
      ws: false,
      changeOrigin: true,
    }),
  );

  app.use(
    '/',
    createProxyMiddleware({
      secure: false,
      target: production ? `https://localhost:${info.prodClientPort}` : `https://localhost:${info.devClientPort}`,
      ws: true,
      changeOrigin: true,
    }),
  );

  // SNI example
  // https
  //   .createServer(
  //     {
  //       SNICallback: (domain, cb) => {
  //         const secureContext = tls.createSecureContext(
  //           domain === 'qwertyapi.ddns.net'
  //             ? {
  //                 key: fs.readFileSync('./var/certs/api/private.key'),
  //                 cert: fs.readFileSync('./var/certs/api/certificate.crt'),
  //                 ca: fs.readFileSync('./var/certs/api/ca_bundle.crt'),
  //               }
  //             : {
  //                 key: fs.readFileSync('./var/certs/web/private.key'),
  //                 cert: fs.readFileSync('./var/certs/web/certificate.crt'),
  //                 ca: fs.readFileSync('./var/certs/web/ca_bundle.crt'),
  //               },
  //         );
  //         if (cb) {
  //           cb(null, secureContext);
  //           return;
  //         }
  //         return secureContext;
  //       },
  //     },
  //     app,
  //   )
  //   .listen(process.env.PORT);

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

  const certs = production
    ? {}
    : {
        key: fs.readFileSync('./sotaoi/api/certs/privkey.pem'),
        cert: fs.readFileSync('./sotaoi/api/certs/fullchain.pem'),
      };

  production
    ? http.createServer(app).listen(process.env.PORT)
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
  if (process.env.PORT === '443') {
    const redirect = express();
    redirect.get('*', (req, res) =>
      res.redirect(`https://${process.env.NODE_ENV !== 'development' ? info.prodDomain : info.devDomain}${req.url}`),
    );
    redirect.listen(80);
  }
};

export { proxy };
