require('dotenv').config();
process.env.PORT = process.env.PORT || '443';
process.env.REDIRECT_FROM_PORT = process.env.REDIRECT_FROM_PORT || '80';

import { execSync } from 'child_process';
import path from 'path';
import express from 'express';
import { Server as HttpServer } from 'http';
import https from 'https';
import tls from 'tls';
import { createProxyMiddleware } from 'http-proxy-middleware';
import fs from 'fs';
import { AppInfo } from '@sotaoi/omni/state';
import { spawn } from 'child_process';
import { Helper } from '@sotaoi/api/helper';
import { logger } from '@sotaoi/api/logger';

let greenlock = false;

const keyPath = path.resolve(process.env.SSL_KEY || '');
const certPath = path.resolve(process.env.SSL_CERT || '');
const chainPath = path.resolve(process.env.SSL_CA || '');
const servers: (https.Server | HttpServer)[] = [];

const certs = () => ({
  key: fs.readFileSync(keyPath),
  cert: fs.readFileSync(certPath),
  ca: fs.readFileSync(chainPath),
});

const getTimestamp = Helper.getTimestamp;
const shutDown = Helper.shutDown;

process.on('SIGTERM', () => {
  shutDown(servers, logger);
});
process.on('SIGINT', () => {
  shutDown(servers, logger);
});
process.on('SIGQUIT', () => {
  shutDown(servers, logger);
});

const startServer = async (app: express.Express, domain: string): Promise<void> => {
  servers.push(
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
      .listen(process.env.PORT),
  );
  logger().info(`[${getTimestamp()}] Proxy server running on port ${process.env.PORT}`);

  // # REDIRECT HTTP to HTTPS
  if (process.env.PORT === '443' && process.env.REDIRECT_FROM_PORT) {
    const expressrdr = express();
    expressrdr.get('*', (req, res) => res.redirect(`https://${domain}${req.url}`));
    servers.push(expressrdr.listen(process.env.REDIRECT_FROM_PORT));
    logger().info(`[${getTimestamp()}] Proxy server redirecting from port ${process.env.REDIRECT_FROM_PORT}`);
  }
};

const proxy = async (appInfo: AppInfo, domain: string, testserver: boolean): Promise<void> => {
  const app = express();

  if (testserver) {
    app.get('*', (req, res) => {
      return res.send('ok');
    });
    servers.push(app.listen(80));
    logger().info(`[${getTimestamp()}] Test non https server listening on port 80`);
    return;
  }

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
  // servers.push(http.createServer(mobileBundleApp).listen(8079));
  // logger().info(`[${getTimestamp()}] Proxy server redirecting from port 8079 to 8081`);

  const startServerInterval = setInterval(async (): Promise<void> => {
    if (!fs.existsSync(keyPath) || !fs.existsSync(certPath) || !fs.existsSync(chainPath)) {
      logger().info('certificates not yet installed. waiting to start server...');
      if (!greenlock && appInfo.greenlockExecution === 'autorun') {
        greenlock = true;
        const greenlockCmd = !Helper.isBuild() ? 'ssl:greenlock' : 'ssl:greenlock:prod';
        const greenlockProcess = spawn('npm', ['run', greenlockCmd]);
        greenlockProcess.stdout.on('data', function (data) {
          logger().info(data.toString());
        });
        greenlockProcess.stderr.on('data', function (data) {
          logger().error(data.toString());
        });
      }
      return;
    }
    clearInterval(startServerInterval);
    await startServer(app, domain);
  }, 5000);
};

export { proxy };
