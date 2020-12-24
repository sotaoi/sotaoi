import { store } from '@sotaoi/client/store';
//
import { RouterProps, redirect } from '@sotaoi/client/router';
import { ErrorComponent } from '@app/client/components/error-component';
import { HomeRoute } from '@app/client/gate-layout/routes/home-route';
// gate
import { GateLayout } from '@app/client/gate-layout/gate-layout';
import { RegisterUserRoute } from '@app/client/gate-layout/routes/register-user-route';
import { AuthUserRoute } from '@app/client/gate-layout/routes/auth-user-route';
// // main
import { MainLayout } from '@app/client/main-layout/main-layout';
import { PostsRoute } from '@app/client/main-layout/routes/posts-route';
import { UsersRoute } from '@app/client/main-layout/routes/users-route';
import { PostRoute } from '@app/client/main-layout/routes/post-route';
import { UserRoute } from '@app/client/main-layout/routes/user-route';
import { UpdateUserRoute } from '@app/client/main-layout/routes/update-user-route';
import { TaskUserRoute } from '@app/client/main-layout/routes/task-user-route';
import { StorePostRoute } from '@app/client/main-layout/routes/store-post-route';
import { HomeUserRoute } from '@app/client/main-layout/views/home-user-route';
//
import { createStore } from 'redux';

const reduxStore = createStore((state: { [key: string]: any } = {}, action: any) => {
  switch (action.type) {
    case 'action':
      return { ...state, ...action.value };
    default:
      return state;
  }
});

const routerProps: RouterProps = {
  config: {
    gateLayout: {
      prefix: '/gate',
      layout: GateLayout,
      routes: {
        '!/': HomeRoute,
        // moonlightmoonshine
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
        '/user/profile': HomeUserRoute,
        '/post/list/all': PostsRoute,
        '/post/view/{uuid}': PostRoute,
        '/post/store': StorePostRoute,
        // '/post/store({/filter})?': StorePostRoute,
        '/user/list/all': UsersRoute,
        '/user/view/{uuid}': UserRoute,
        '/user/edit/{uuid}': UpdateUserRoute,
        '/user/hello-task': TaskUserRoute,
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
};

export { routerProps };
