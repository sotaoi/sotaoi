import { store } from '@sotaoi/client/store';
//
import { routes as clientRoutes, RouterProps, redirect } from '@sotaoi/client/router';
import { ErrorComponent } from '@app/client/components/generic/error-component';
import { HomeRoute } from '@app/client/components/gate-layout/routes/home-route';
// gate
import { GateLayout } from '@app/client/components/gate-layout/gate-layout';
import { RegisterUserRoute } from '@app/client/components/gate-layout/routes/register-user-route';
import { AuthUserRoute } from '@app/client/components/gate-layout/routes/auth-user-route';
// main
import { MainLayout } from '@app/client/components/main-layout/main-layout';
import { UsersRoute } from '@app/client/components/main-layout/routes/users-route';
import { UserRoute } from '@app/client/components/main-layout/routes/user-route';
import { UpdateUserRoute } from '@app/client/components/main-layout/routes/update-user-route';
import { HomeUserRoute } from '@app/client/components/main-layout/routes/home-user-route';

// // custom redux store is working
// const reduxStore = createStore((state: { [key: string]: any } = {}, action: any) => {
//   switch (action.type) {
//     case 'action':
//       return { ...state, ...action.value };
//     default:
//       return state;
//   }
// });

const routes: RouterProps = clientRoutes('s-control-panel', {
  config: {
    gateLayout: {
      prefix: '/gate',
      layout: GateLayout,
      routes: {
        '!/': HomeRoute,
        // moonlightmoonshine (app admin system, bundle admin system)
        '/register/{repository}(/{filters})?': RegisterUserRoute,
        '/auth/{repository}': AuthUserRoute,
      },
      condition: (): boolean => {
        if (store().getAuthRecord()) {
          redirect('/');
          return false;
        }
        return true;
      },
    },
    mainLayout: {
      prefix: '/',
      layout: MainLayout,
      routes: {
        '!/': HomeRoute,
        '/user/profile/{uuid}': HomeUserRoute,

        '/user/list/all': UsersRoute,
        '/user/view/{uuid}': UserRoute,
        '/user/edit/{uuid}': UpdateUserRoute,
      },
      condition: (): boolean => {
        if (!store().getAuthRecord()) {
          redirect('/gate/auth/user');
          return false;
        }
        return true;
      },
    },
  },
  errorComponent: ErrorComponent,
  // reduxStore,
});

export { routes };
