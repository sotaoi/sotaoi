process.env.PORT = process.env.PORT || '443';
process.env.REDIRECT_FROM_PORT = process.env.REDIRECT_FROM_PORT || '80';

import express from 'express';
import http from 'http';
import https from 'https';
import tls from 'tls';
import { createProxyMiddleware } from 'http-proxy-middleware';
import fs from 'fs';
import { AppInfo } from '@sotaoi/omni/state';

const proxy = async (appInfo: AppInfo): Promise<void> => {
  const getTimestamp = () => new Date().toISOString().substr(0, 19).replace('T', ' ');

  const production = process.env.NODE_ENV === 'production';
  const app = express();

  // temporarily use localhost domain, so that heroku deployment will work

  app.use(
    '/api',
    (req, res, next): express.Response => {
      let ok = false;
      for (let validDomain of [
        appInfo.prodDomain,
        appInfo.devDomain,
        appInfo.prodDomainAlias,
        appInfo.devDomainAlias,
        appInfo.apiDomainHelper,
      ]) {
        const domain = req.get('host') || '';
        if (domain.indexOf(validDomain) === -1) {
          continue;
        }
        ok = true;
        break;
      }
      if (!ok) {
        return res.send({ error: 'Not Found', message: 'Not Found', statusCode: 404 });
      }
      return createProxyMiddleware({
        secure: false,
        // pathRewrite: {
        //   '^/api/': '/api/',
        // },
        target: production ? `https://localhost:${appInfo.prodApiPort}` : `https://localhost:${appInfo.devApiPort}`,
        ws: false,
        changeOrigin: true,
      })(req, res, next);
    },
  );

  // app.use(
  //   '/socket.io',
  //   (req, res, next): express.Response => {
  //     return createProxyMiddleware({
  //       secure: false,
  //       target: `https://localhost:${appInfo.streamingPort}`,
  //       ws: true,
  //       changeOrigin: true,
  //     })(req, res, next);
  //   },
  // );

  app.use(
    '/',
    (req, res, next): express.Response => {
      let ok = false;
      for (let validDomain of [
        appInfo.prodDomain,
        appInfo.devDomain,
        appInfo.prodDomainAlias,
        appInfo.devDomainAlias,
        appInfo.apiDomainHelper,
      ]) {
        const domain = req.get('host') || '';
        if (domain.indexOf(validDomain) === -1) {
          continue;
        }
        ok = true;
        break;
      }
      if (!ok) {
        return res.send({ error: 'Not Found', message: 'Not Found', statusCode: 404 });
      }
      return createProxyMiddleware({
        secure: false,
        target: production
          ? `https://localhost:${appInfo.prodClientPort}`
          : `https://localhost:${appInfo.devClientPort}`,
        ws: true,
        changeOrigin: true,
      })(req, res, next);
    },
  );

  production
    ? http.createServer(app).listen(process.env.PORT)
    : https
        .createServer(
          {
            SNICallback: async (domain, cb) => {
              const secureContext = tls.createSecureContext(
                await (async (): Promise<{ [key: string]: any }> => {
                  // other sync / async procedures can go here
                  return {
                    key: fs.readFileSync('./sotaoi/api/certs/privkey.pem'),
                    cert: fs.readFileSync('./sotaoi/api/certs/fullchain.pem'),
                    // key: fs.readFileSync('./sotaoi/api/certs/private.key'),
                    // cert: fs.readFileSync('./sotaoi/api/certs/certificate.crt'),
                    // ca_bundle: fs.readFileSync('./sotaoi/api/certs/ca_bundle.crt'),
                  };
                })(),
              );
              if (cb) {
                cb(null, secureContext);
                return;
              }
              return secureContext;
            },
            rejectUnauthorized: false,
          },
          app,
        )
        .listen(process.env.PORT);
  console.log(`[${getTimestamp()}] Proxy server running on port ${process.env.PORT}`);

  // # REDIRECT HTTP to HTTPS
  if (process.env.PORT === '443' && process.env.REDIRECT_FROM_PORT) {
    const redirect = express();
    redirect.get('*', (req, res) =>
      res.redirect(
        `https://${process.env.NODE_ENV !== 'development' ? appInfo.prodDomain : appInfo.devDomain}${req.url}`,
      ),
    );
    redirect.listen(process.env.REDIRECT_FROM_PORT);
    console.log(`[${getTimestamp()}] Proxy server redirecting from port ${process.env.REDIRECT_FROM_PORT}`);
  }
};

export { proxy };
