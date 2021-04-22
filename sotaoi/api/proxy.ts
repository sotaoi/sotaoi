require('dotenv').config();
process.env.PORT = process.env.PORT || '443';
process.env.REDIRECT_FROM_PORT = process.env.REDIRECT_FROM_PORT || '80';

import { execSync } from 'child_process';
import path from 'path';
import express, { Express } from 'express';
import https from 'https';
import tls from 'tls';
import { createProxyMiddleware } from 'http-proxy-middleware';
import fs from 'fs';
import { AppInfo } from '@sotaoi/omni/state';
import { spawn } from 'child_process';

let greenlock = false;

const keyPath = path.resolve(process.env.SSL_KEY || '');
const certPath = path.resolve(process.env.SSL_CERT || '');
const chainPath = path.resolve(process.env.SSL_CA || '');

const certs = () => ({
  key: fs.readFileSync(keyPath),
  cert: fs.readFileSync(certPath),
  ca: fs.readFileSync(chainPath),
});

const getTimestamp = () => new Date().toISOString().substr(0, 19).replace('T', ' ');

const startServer = async (app: Express, domain: string): Promise<void> => {
  https
    .createServer(
      {
        SNICallback: async (currentDomain, cb) => {
          const secureContext = tls.createSecureContext(
            await (async (): Promise<{ [key: string]: any }> => {
              // other sync / async procedures can go here
              return {
                ...certs(),
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
  console.info(`[${getTimestamp()}] Proxy server running on port ${process.env.PORT}`);
};

const proxy = async (appInfo: AppInfo, domain: string): Promise<void> => {
  const app = express();

  const validDomains = [
    appInfo.prodDomain,
    appInfo.prodDomainAlias,
    appInfo.stageDomain,
    appInfo.stageDomainAlias,
    appInfo.devDomain,
    appInfo.devDomainAlias,
    appInfo.localDomain,
    appInfo.localDomainAlias,
  ];

  app.use((req, res, next) => {
    if (req.url === '/') {
      return next();
    }
    return express.static('./public')(req, res, next);
  });

  app.use(
    '/api',
    (req, res, next): express.Response => {
      let ok = false;
      for (const validDomain of validDomains) {
        const currentDomain = req.get('host') || '';
        if (currentDomain.indexOf(validDomain) === -1) {
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
        // target: `https://${domain}:3000`,
        target: `https://localhost:3000`,
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
  //       // target: `https://${domain}:${appInfo.streamingPort}`,
  //       target: `https://localhost:${appInfo.streamingPort}`,
  //       ws: true,
  //       changeOrigin: true,
  //     })(req, res, next);
  //   },
  // );

  JSON.parse(execSync('php artisan routes', { cwd: './php' }).toString()).map((route: string) => {
    route = route.replace(new RegExp('{(?:\\s+)?(.*)(?:\\s+)?}'), ':$1');
    app.use(
      route,
      (req, res, next): express.Response => {
        return createProxyMiddleware({
          secure: false,
          // target: `https://${domain}:4000`,
          target: `https://localhost:4000`,
          ws: true,
          changeOrigin: true,
        })(req, res, next);
      },
    );
  });

  app.use(
    '/',
    (req, res, next): express.Response => {
      let ok = false;
      for (const validDomain of validDomains) {
        const currentDomain = req.get('host') || '';
        if (currentDomain !== validDomain) {
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
        // target: `https://${domain}:8080`,
        target: `https://localhost:8080`,
        ws: true,
        changeOrigin: false,
      })(req, res, next);
    },
  );

  // const mobileBundleApp = express();
  // mobileBundleApp.use(
  //   createProxyMiddleware({
  //     // target: `http://${domain}:8081`,
  //     target: `http://localhost:8081`,
  //     ws: true,
  //     changeOrigin: true,
  //   }),
  // );
  // http.createServer(mobileBundleApp).listen(8079);
  // console.info(`[${getTimestamp()}] Proxy server redirecting from port 8079 to 8081`);

  const startServerInterval = setInterval(async (): Promise<void> => {
    if (process.env.GREENLOCK === 'yes') {
      return;
    }
    if (!fs.existsSync(keyPath) || !fs.existsSync(certPath) || !fs.existsSync(chainPath)) {
      console.info('certificates not yet installed. waiting to start server...');
      if (!greenlock && appInfo.greenlockExecution === 'autorun') {
        greenlock = true;
        const envFlag =
          process.env.NODE_ENV === 'production' ? 'prod' : process.env.NODE_ENV === 'staging' ? 'stage' : 'dev';
        const greenlockProcess = spawn('npm', ['run', `${envFlag}:greenlock`]);
        greenlockProcess.stdout.on('data', function (data) {
          console.info(data.toString());
        });
        greenlockProcess.stderr.on('data', function (data) {
          console.error(data.toString());
        });
      }
      return;
    }
    clearInterval(startServerInterval);
    await startServer(app, domain);
  }, 5000);

  // # REDIRECT HTTP to HTTPS
  if (process.env.PORT === '443' && process.env.REDIRECT_FROM_PORT) {
    const expressrdr = express();
    expressrdr.get('*', (req, res) => {
      if (req.url.substr(0, 12) === '/.well-known') {
        console.info(`running acme verification: ${req.url}`);
        const acme = fs.readdirSync(path.resolve('./var/greenlock.d/accounts'));
        const urlSplit = req.url.substr(1).split('/');
        const credentials = require(path.resolve(
          `./var/greenlock.d/accounts/${acme[0]}/directory/${appInfo.sslMaintainer}.json`,
        ));
        console.info('greenlock credentials:', credentials);
        return res.send(urlSplit[2] + '.' + credentials.publicKeyJwk.kid);
      }
      return res.redirect(`https://${domain}${req.url}`);
    });
    expressrdr.listen(process.env.REDIRECT_FROM_PORT);
    console.info(`[${getTimestamp()}] Proxy server redirecting from port ${process.env.REDIRECT_FROM_PORT}`);
  }
};

export { proxy };
