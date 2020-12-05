import { FormValidations } from '@sotaoi/omni/input';
import fs from 'fs';
import Hapi, { ResponseToolkit } from '@hapi/hapi';
import { Setup, RepositoryHandlers } from '@sotaoi/api/setup';
import { greetingRoute } from '@sotaoi/api/routes/greeting-route';
import { seedRoute } from '@sotaoi/api/routes/seed-route';
import { notFoundRoute } from '@sotaoi/api/routes/not-found-route';
import { renderWebRoute } from '@sotaoi/api/routes/render-web-route';
import { AppKernel, app } from '@sotaoi/api/app-kernel';
import { storeRoute } from '@sotaoi/api/routes/store-route';
import { updateRoute } from '@sotaoi/api/routes/update-route';
import { queryRoute } from '@sotaoi/api/routes/query-route';
import { retrieveRoute } from '@sotaoi/api/routes/retrieve-route';
import { removeRoute } from '@sotaoi/api/routes/remove-route';
import { authRoute } from '@sotaoi/api/routes/auth-route';
import { taskRoute } from '@sotaoi/api/routes/task-route';
import Inert from '@hapi/inert';
import Vision from '@hapi/vision';
import { Helper } from '@sotaoi/api/helper';
import { AppInfo } from '@sotaoi/omni/state';
import { Logger } from '@sotaoi/api/contracts';
import { AuthRecord } from '@sotaoi/omni/artifacts';
import { AuthHandler } from '@sotaoi/api/commands/auth-handler';
const HapiCors = require('hapi-cors');

class Server {
  public static async init(
    appInfo: AppInfo,
    appKernel: AppKernel,
    handlers: { [key: string]: RepositoryHandlers },
    forms: { [key: string]: { [key: string]: () => Promise<FormValidations> } },
    translateAccessToken: (handler: ResponseToolkit, accessToken: string) => Promise<null | AuthRecord>,
  ): Promise<void> {
    try {
      AuthHandler.setTranslateAccessToken(translateAccessToken);

      appKernel.bootstrap();
      const isHeroku = process.env.NODE_ENV !== 'development' && appInfo.deploymentTarget === 'heroku';
      await Setup.init(handlers, forms);

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

      const server = Hapi.server({
        port: process.env.PORT || 3000,
        host: '0.0.0.0',
        routes: {
          files: {
            relativeTo: Helper.getPublicPath(),
          },
        },
        ...(isHeroku
          ? {}
          : {
              tls: {
                ...certs,
                rejectUnauthorized: false,
              },
            }),
      });

      server.route(greetingRoute);
      server.route(seedRoute);

      server.route(storeRoute);
      server.route(updateRoute);
      server.route(queryRoute);
      server.route(retrieveRoute);
      server.route(removeRoute);
      server.route(authRoute);
      server.route(taskRoute);

      process.env.NODE_ENV === 'production' && server.route(renderWebRoute);
      server.route(notFoundRoute);

      await server.register([Inert, Vision, HapiCors]);

      await server.start();
      app().get<Logger>(Logger).info(`Hapi server running on ${server.info.uri}`);
    } catch (err) {
      console.error(err);
    }
  }
}

export { Server };
