import express from 'express';
import https from 'https';
import { createProxyMiddleware } from 'http-proxy-middleware';
import fs from 'fs';
import { AppInfo } from '@sotaoi/omni/state';

const proxy = (info: AppInfo): void => {
  const app = express();

  app.use(
    '/api',
    createProxyMiddleware({
      secure: false,
      pathRewrite: {
        '^/api/': '/api/',
      },
      target: `https://${info.devApiDomain}:${info.devApiPort}`,
      changeOrigin: true,
    }),
  );

  app.use(
    '/',
    createProxyMiddleware({
      secure: false,
      target: `https://${info.devClientDomain}:${info.devClientPort}`,
      ws: true,
      changeOrigin: true,
    }),
  );

  const certs =
    process.env.NODE_ENV === 'development'
      ? {
          key: fs.readFileSync('./sotaoi/api/certs/privkey.pem'),
          cert: fs.readFileSync('./sotaoi/api/certs/fullchain.pem'),
        }
      : {
          key: fs.readFileSync('./sotaoi/api/certs/private.key'),
          cert: fs.readFileSync('./sotaoi/api/certs/certificate.crt'),
          ca: fs.readFileSync('./sotaoi/api/certs/ca_bundle.crt'),
        };

  https
    .createServer(
      {
        ...certs,
        rejectUnauthorized: false,
      },
      app,
    )
    .listen(process.env.PORT || 443);

  // # REDIRECT HTTP to HTTPS
  if (process.env.PORT !== '443') {
    return;
  }
  const redirect = express();
  redirect.get('*', (req, res) =>
    res.redirect(`https://${process.env.NODE_ENV !== 'development' ? info.prodDomain : info.devDomain}${req.url}`),
  );
  redirect.listen(80);
};

export { proxy };
