import { FormValidations } from '@sotaoi/omni/input';
import fs from 'fs';
import Hapi, { ResponseToolkit } from '@hapi/hapi';
import { Setup, RepositoryHandlers } from '@sotaoi/api/setup';
import { greetingRoute } from '@sotaoi/api/routes/greeting-route';
import { seedRoute } from '@sotaoi/api/routes/seed-route';
import { notFoundRoute } from '@sotaoi/api/routes/not-found-route';
import { AppKernel, app } from '@sotaoi/api/app-kernel';
import { storeRoute } from '@sotaoi/api/routes/store-route';
import { updateRoute } from '@sotaoi/api/routes/update-route';
import { queryRoute } from '@sotaoi/api/routes/query-route';
import { retrieveRoute } from '@sotaoi/api/routes/retrieve-route';
import { removeRoute } from '@sotaoi/api/routes/remove-route';
import { authRoute } from '@sotaoi/api/routes/auth-route';
import { deauthRoute } from '@sotaoi/api/routes/deauth-route';
import { taskRoute } from '@sotaoi/api/routes/task-route';
import { storageRoute } from '@sotaoi/api/routes/storage-route';
import Inert from '@hapi/inert';
import Vision from '@hapi/vision';
import { AppInfo } from '@sotaoi/omni/state';
import { Logger } from '@sotaoi/api/contracts';
import { AuthRecord } from '@sotaoi/omni/artifacts';
import { AuthHandler } from '@sotaoi/api/commands/auth-handler';
import socketio from 'socket.io';
import express from 'express';
import https from 'https';
const HapiCors = require('hapi-cors');

class Server {
  public static async init(
    appInfo: AppInfo,
    appKernel: AppKernel,
    handlers: { [key: string]: RepositoryHandlers },
    forms: { [key: string]: { [key: string]: () => Promise<FormValidations> } },
    translateAccessToken: (
      handler: ResponseToolkit,
      accessToken: string,
    ) => Promise<[null | AuthRecord, null | string]>,
    deauth: (handler: ResponseToolkit) => Promise<void>,
  ): Promise<void> {
    try {
      AuthHandler.setTranslateAccessToken(translateAccessToken);
      AuthHandler.setDeauth(deauth);

      appKernel.bootstrap();
      await Setup.init(handlers, forms);

      const certs = {
        key: fs.readFileSync('./sotaoi/api/certs/privkey.pem'),
        cert: fs.readFileSync('./sotaoi/api/certs/fullchain.pem'),
        // key: fs.readFileSync('./sotaoi/api/certs/private.key'),
        // cert: fs.readFileSync('./sotaoi/api/certs/certificate.crt'),
        // ca: fs.readFileSync('./sotaoi/api/certs/ca_bundle.crt'),
      };

      const server = Hapi.server({
        port: process.env.PORT || '3000',
        host: '0.0.0.0',
        tls: {
          ...certs,
          rejectUnauthorized: false,
        },
      });

      server.route(greetingRoute);
      server.route(seedRoute);

      server.route(storeRoute);
      server.route(updateRoute);
      server.route(queryRoute);
      server.route(retrieveRoute);
      server.route(removeRoute);
      server.route(authRoute);
      server.route(deauthRoute);
      server.route(taskRoute);

      server.route(storageRoute);

      server.route(notFoundRoute);

      await server.register([Inert, Vision, HapiCors]);

      const expressApp = express();
      const httpsServer = https.createServer(
        {
          key: fs.readFileSync('./sotaoi/api/certs/privkey.pem'),
          cert: fs.readFileSync('./sotaoi/api/certs/fullchain.pem'),
          // key: fs.readFileSync('./sotaoi/api/certs/private.key'),
          // cert: fs.readFileSync('./sotaoi/api/certs/certificate.crt'),
          // ca_bundle: fs.readFileSync('./sotaoi/api/certs/ca_bundle.crt'),
        },
        expressApp,
      );
      const io = (socketio as any)(httpsServer);
      io.on('connection', (socket: any) => {
        // do nothing
      });
      httpsServer.listen(3001, () => {
        console.log('listening on *:3001 (socket.io)');
      });

      await server.start();
      app().get<Logger>(Logger).info(`Hapi server running on ${server.info.uri}`);
    } catch (err) {
      console.error(err);
    }
  }
}

export { Server };
