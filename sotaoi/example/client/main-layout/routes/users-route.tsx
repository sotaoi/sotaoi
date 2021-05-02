import React from 'react';
import { RouteComponent, RouteData } from '@sotaoi/client/components';
import { UsersView } from '@app/client/main-layout/views/users-view';

interface NoProps {}
class UsersRoute extends RouteComponent<NoProps> {
  public display(props: RouteData<NoProps>): null | React.ReactElement {
    return <UsersView />;
  }

  public web(props: RouteData<NoProps>): null | React.ReactElement {
    return this.display(props);
  }

  public mobile(props: RouteData<NoProps>): null | React.ReactElement {
    return this.display(props);
  }

  public electron(props: RouteData<NoProps>): null | React.ReactElement {
    return this.display(props);
  }
}

export { UsersRoute };
